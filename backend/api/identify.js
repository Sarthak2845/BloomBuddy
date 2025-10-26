import express from "express";
import axios from "axios";
import FormData from "form-data";
import OpenAI from "openai";
import fs from "fs";
import multer from "multer";

const app = express();
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY ,
  baseURL: "https://openrouter.ai/api/v1"
});

const PLANTNET_URL = (project = "all") =>
  `https://my-api.plantnet.org/v2/identify/${project}?api-key=${process.env.PLANTNET_KEY}`;

app.post("/api/identify", upload.array("images", 5), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No images uploaded" });
  }

  // Helper to cleanup multer temp files
  const cleanupFiles = () => {
    req.files.forEach((f) => {
      try { fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
    });
  };

  try {
    // Build FormData for PlantNet
    const form = new FormData();
    // If client provided organs in body, use them; otherwise default to 'leaf'
    const organsFromBody = Array.isArray(req.body.organs) ? req.body.organs : (req.body.organs ? [req.body.organs] : []);
    req.files.forEach((file, idx) => {
      const organ = organsFromBody[idx] || "leaf";
      form.append("organs", organ);
      form.append("images", fs.createReadStream(file.path));
    });

    const plantRes = await axios.post(PLANTNET_URL("all"), form, {
      headers: { ...form.getHeaders() },
      timeout: 30000,
    });

    const plantData = plantRes.data;
    if (!plantData || !Array.isArray(plantData.results) || plantData.results.length === 0) {
      cleanupFiles();
      return res.status(404).json({ error: "No identification results from PlantNet" });
    }

    // pick highest score result (defensive)
    const bestResult = plantData.results.reduce((best, cur) => (cur.score > (best?.score ?? -1) ? cur : best), plantData.results[0]);
    const species = bestResult.species || {};
    const scientificName = species.scientificNameWithoutAuthor || "";
    const commonNames = species.commonNames || [];
    const family = species.family?.scientificNameWithoutAuthor || "";
    const score = bestResult.score ?? null;

    // Prepare prompt for OpenAI - request strict JSON output
    const prompt = `You are a plant-care assistant. Given the species identified below, produce a single JSON object (no surrounding text) with the following fields:
{
  "scientific_name": "string",
  "common_names": ["string"],
  "family": "string",
  "category": "string",
  "short_description": "string",
  "care": {
    "watering": "string",
    "sunlight": "string",
    "soil": "string",
    "temperature": "string",
    "fertilizer": "string",
    "pruning": "string"
  },
  "pests_and_diseases": "string",
  "medicinal_use": "string",
  "pet_friendly": "string",
  "typical_health_issues": "string",
  "recommended_action": "string"
}

Species info:
- scientific_name: "${scientificName || "unknown"}"
- family: "${family || "unknown"}"
- identification_confidence: ${score ?? 0}

Return valid JSON only. If you are unsure about any field, provide a best-effort reasonable value and mark it with the word 'approx' in the text.`;


    // Call OpenAI (chat completion). Keep temperature low for deterministic output.
    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You must return only valid JSON matching the requested schema." },
        { role: "user", content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.2,
    });

    const aiMessage = aiRes?.choices?.[0]?.message?.content;
    if (!aiMessage) {
      cleanupFiles();
      return res.status(502).json({ error: "AI did not return a response" });
    }

    let plantInfo;
    try {
      plantInfo = JSON.parse(aiMessage);
    } catch (e) {
      // Attempt to extract JSON substring if assistant included extra text
      const jsonMatch = aiMessage.match(/\{[\s\S]*\}$/);
      if (jsonMatch) {
        plantInfo = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI JSON response");
      }
    }

    // Combine PlantNet raw data and AI result for the client
    const responsePayload = {
      plantnet: {
        raw: plantData,
        best_result: bestResult,
        scientific_name: scientificName,
        common_names: commonNames,
        family,
        score,
      },
      ai: plantInfo,
    };

    cleanupFiles();
    return res.json(responsePayload);

  } catch (err) {
    cleanupFiles();
    console.error("identify error:", err?.response?.data ?? err?.message ?? err);
    const status = err?.response?.status || 500;
    const message = err?.response?.data || err?.message || "Identification failed";
    return res.status(status).json({ error: message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
