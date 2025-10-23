import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAppId } from '../firebase/config';
import axios, { isAxiosError } from 'axios';
import { GoogleGenAI } from '@google/genai';

const PLANTNET_IDENTIFY_URL = `https://my-api.plantnet.org/v2/identify/all?api-key=${process.env.PLANTNET_API_KEY}`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface GeoLocation {
    lat: number;
    lng: number;
}
interface ClientMetadata {
    imageUrl: string;
    uploadedAt: string;
    geolocation: GeoLocation;
}
interface ImageFile {
    uri: string;
    name: string;
    type: string;
}

export async function processPlantPhoto(
    imageFile: ImageFile,
    metadata: ClientMetadata
) {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const appId = getAppId();

    if (!userId) {
        console.error("User is not authenticated. Cannot save data.");
        throw new Error("Authentication required.");
    }

    let scientificName: string | null = null;
    let careData: any = null;
    try {
        const formData = new FormData();
        formData.append('images', {
            uri: imageFile.uri,
            name: imageFile.name,
            type: imageFile.type,
        } as any);
        formData.append('organs', 'leaf');
        formData.append('organs', 'flower');

        const response = await axios.post(PLANTNET_IDENTIFY_URL, formData, {
            headers: {
                'Accept': 'application/json',
            },
        });

        const data = response.data;

        if (data.results && data.results.length > 0) {
            const bestResult = data.results[0];
            scientificName = bestResult.species?.scientificNameWithoutAuthor || bestResult.species?.commonNames?.[0] || 'Unknown Species';

        } else {
            throw new Error("Pl@ntNet identification failed: No results returned.");
        }

    } catch (error) {
        const errorDetail = isAxiosError(error) ? error.response?.data?.message || error.message : (error as Error).message;
        console.error("Pl@ntNet API Error:", errorDetail);

        throw new Error(`Identification failed. Pl@ntNet API error: ${errorDetail}`);
    }

    const prompt = `Generate a detailed analysis for the species "${scientificName}" and provide the result using the requested JSON schema. For fields like healthStatus, diseaseType, and recommendedAction, provide the most common and likely response for a typical healthy ${scientificName} plant. Ensure the 'species' field exactly matches the scientific name provided here.`;

    try {
        const response = await (ai.models.generateContent as any)({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        "species": { "type": "STRING", "description": "The scientific name of the plant, e.g., Aloe vera." },
                        "commonName": { "type": "STRING", "description": "The common, easy-to-read name." },
                        "family": { "type": "STRING", "description": "The plant's botanical family." },
                        "healthStatus": { "type": "STRING", "description": "The generalized health status (e.g., Healthy, Needs Water, Common Pests)." },
                        "diseaseType": { "type": "STRING", "nullable": true, "description": "The likely disease or null if healthy." },
                        "careTips": {
                            "type": "OBJECT",
                            "properties": {
                                "waterFrequency": { "type": "STRING" },
                                "sunlight": { "type": "STRING" },
                                "soil": { "type": "STRING" },
                                "fertilizer": { "type": "STRING" },
                                "humidity": { "type": "STRING" },
                                "growthStage": { "type": "STRING" },
                                "seasonalTips": { "type": "STRING" }
                            }
                        },
                        "medicinalBenefits": { "type": "ARRAY", "items": { "type": "STRING" } },
                        "edibleParts": { "type": "ARRAY", "items": { "type": "STRING" } },
                        "toxicity": { "type": "STRING" },
                        "culturalUse": { "type": "STRING" },
                        "ecologicalRole": { "type": "STRING" },
                        "recommendedAction": { "type": "STRING", "description": "A single, actionable tip for the owner." }
                    }
                }
            },
        } as any);
        const jsonText = response.text;

        if (jsonText) {
            careData = JSON.parse(jsonText);
        } else {
            throw new Error("Gemini API returned an invalid response.");
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
    }

    const db = getFirestore();
    const analysisId = crypto.randomUUID();

    const finalDocument = {
        ...careData,
        species: careData?.species || scientificName,
        imageUrl: metadata.imageUrl,
        uploadedAt: metadata.uploadedAt,
        geolocation: metadata.geolocation,
        userId: userId,
        status: careData ? 'COMPLETED' : 'PARTIAL_AI_FAILED',
        createdAt: serverTimestamp(),
        analysisId: analysisId
    };

    try {
        const collectionPath = `artifacts/${appId}/users/${userId}/plant_analyses`;

        const docRef = await addDoc(collection(db, collectionPath), finalDocument);

        console.log("Analysis saved to Firestore with ID:", docRef.id);

        return {
            ...finalDocument,
            id: docRef.id
        };

    } catch (error) {
        console.error("Firestore Save Error:", error);
        throw new Error("Analysis failed to save to database.");
    }
}
