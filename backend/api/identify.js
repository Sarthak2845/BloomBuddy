import axios from "axios";
import FormData from "form-data";
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { imageUrls } = req.body; // array of 1–5 image URLs
    if (!imageUrls || imageUrls.length === 0)
      return res.status(400).json({ error: "No image URLs provided" });

    // 1️⃣ Prepare FormData for PlantNet
    const form = new FormData();
    imageUrls.forEach(() => form.append("organs", "leaf"));
    for (const url of imageUrls) {
      const img = await axios.get(url, { responseType: "arraybuffer" });
      form.append("images", img.data, "plant.jpg");
    }

    // 2️⃣ Call PlantNet API
    const plantRes = await axios.post(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${process.env.PLANTNET_KEY}`,
      form,
      { headers: form.getHeaders() }
    );

    const best = plantRes.data.results[0];
    const scientificName = best.species.scientificNameWithoutAuthor;
    const commonNames = best.species.commonNames || [];
    const family = best.species.family?.scientificNameWithoutAuthor || "";

    // 3️⃣ Ask OpenAI for structured info
    const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
    const prompt = `
You are a professional botanist.  
Provide the following structured JSON data (no extra text) for the plant "${scientificName}" (${commonNames.join(", ")}), family ${family}:

{
  "scientific_name": "",
  "common_name": "",
  "category": "",
  "family": "",
  "general_traits": "",
  "description": "",
  "watering_times": "",
  "fertilizer": "",
  "temperature": "",
  "sunlight": "",
  "soil": "",
  "pests": "",
  "diseases": "",
  "medicinal_use": "",
  "pet_friendly": ""
}

All values should be concise, factual, and formatted for app display.
`;

    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You provide structured plant information." },
        { role: "user", content: prompt }
      ]
    });

    const plantInfo = JSON.parse(ai.choices[0].message.content);

    // 4️⃣ Return full structured result
    res.json({
      scientific_name: plantInfo.scientific_name || scientificName,
      common_name: plantInfo.common_name || commonNames.join(", "),
      ...plantInfo
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process plant identification" });
  }
}
