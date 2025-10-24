import { db, auth, functions } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

interface GeoLocation { lat: number; lng: number; }
interface ImageFile { uri: string; name: string; type: string; }

// Upload image to Cloudinary
export const uploadToCloudinary = async (imageUri: string): Promise<string> => {
  // Convert any URI (file://, data:, http(s)...) to a Blob which works cross-platform
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const formData = new FormData();
  // Append the blob and provide a filename (third param) so Cloudinary receives it correctly
  formData.append("file", blob as any, "plant.jpg");
  formData.append("upload_preset", process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  if (!res.ok || !data.secure_url) {
    console.error("Cloudinary response:", data);
    throw new Error("Cloudinary upload failed");
  }

  return data.secure_url;
};



// Process plant photo
export async function processPlantPhoto(imageFile: ImageFile, geolocation: GeoLocation = { lat: 0, lng: 0 }) {
  if (!auth.currentUser) throw new Error("Authentication required");
  const userId = auth.currentUser.uid;

  // 1️⃣ Upload
  const imageUrl = await uploadToCloudinary(imageFile.uri);

  // 2️⃣ Call PlantNet Cloud Function
  const identifyPlant = httpsCallable(functions, "identifyPlant");
  let scientificName = "Unknown Species";
  try {
    const res: any = await identifyPlant({ imageUrl });
    if (res.data.results?.length) {
      const best = res.data.results[0];
      scientificName = best.species?.scientificNameWithoutAuthor || best.species?.commonNames?.[0] || scientificName;
    }
  } catch (err) {
    console.warn("PlantNet identification failed, using fallback", err);
    scientificName = "Aloe vera";
  }

  // 3️⃣ Gemini AI
  const prompt = `Generate a detailed JSON analysis for "${scientificName}" with fields:
  species, commonName, family, healthStatus, diseaseType (nullable),
  careTips {waterFrequency, sunlight, soil, fertilizer, humidity, growthStage, seasonalTips},
  medicinalBenefits (array), edibleParts (array), toxicity, culturalUse, ecologicalRole, recommendedAction.`;

  let careData: any = null;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    if (text) {
      const cleanJson = text.replace(/```(json)?/g, "").trim();
      careData = JSON.parse(cleanJson);
    }
  } catch (err) {
    console.error("Gemini AI failed:", err);
  }

  // 4️⃣ Save to Firestore
  const analysisId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const finalDocument = {
    ...careData,
    species: careData?.species || scientificName,
    imageUrl: imageUrl || "",
    uploadedAt: new Date().toISOString(),
    geolocation,
    userId,
    status: careData ? "COMPLETED" : "PARTIAL_AI_FAILED",
    createdAt: serverTimestamp(),
    analysisId,
  };

  const docRef = await addDoc(collection(db, "plants"), finalDocument);
  return { id: docRef.id, ...finalDocument };
}
