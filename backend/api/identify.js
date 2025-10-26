import 'dotenv/config';
import express from "express";
import axios from "axios";
import FormData from "form-data";
import OpenAI from "openai";
import fs from "fs";
import multer from "multer";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ dest: "/tmp/uploads/" });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY ,
  baseURL: "https://openrouter.ai/api/v1"
});

const PLANTNET_URL = (project = "all") =>
  `https://my-api.plantnet.org/v2/identify/${project}?api-key=${process.env.PLANTNET_KEY}`;

// Name-based search endpoint
app.get("/api/identify", async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Plant name is required" });
  }

  try {
    const prompt = `You are a plant expert. Given the plant name "${name}", provide detailed information in this exact JSON format:
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

Return only valid JSON.`;

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
      return res.status(502).json({ error: "AI did not return a response" });
    }

    let plantInfo;
    try {
      plantInfo = JSON.parse(aiMessage);
    } catch (e) {
      const jsonMatch = aiMessage.match(/\{[\s\S]*\}$/);
      if (jsonMatch) {
        plantInfo = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI JSON response");
      }
    }

    const responsePayload = {
      plantnet: {
        raw: {},
        best_result: {},
        scientific_name: plantInfo.scientific_name,
        common_names: plantInfo.common_names,
        family: plantInfo.family,
        score: 0.9,
      },
      ai: plantInfo,
    };

    return res.json(responsePayload);
  } catch (err) {
    console.error("name search error:", err?.message ?? err);
    return res.status(500).json({ error: "Failed to search plant by name" });
  }
});

app.post("/api/identify", upload.array("images", 5), async (req, res) => {
  console.log('POST /api/identify - Files received:', req.files?.length || 0);
  console.log('Body organs:', req.body.organs);
  
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

// Location-based plant recommendations
app.post("/api/recommend", async (req, res) => {
  const { latitude, longitude, address } = req.body;
  
  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Location coordinates are required" });
  }

  try {
    const prompt = `You are a plant expert. Based on the location coordinates (${latitude}, ${longitude}) ${address ? `in ${address}` : ''}, recommend the best plants to grow in this area. Consider climate, soil conditions, and local growing conditions.

Provide recommendations in this exact JSON format:
{
  "location_info": {
    "climate_zone": "string",
    "season": "string",
    "temperature_range": "string",
    "humidity": "string",
    "soil_type": "string"
  },
  "recommended_plants": [
    {
      "name": "string",
      "scientific_name": "string",
      "category": "string",
      "difficulty": "Easy|Medium|Hard",
      "best_season": "string",
      "growth_time": "string",
      "benefits": "string",
      "care_tips": "string",
      "watering_frequency": "string"
    }
  ],
  "seasonal_tips": "string",
  "local_considerations": "string"
}

Return only valid JSON with 5-8 plant recommendations.`;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a plant expert providing location-specific recommendations. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1200,
      temperature: 0.3,
    });

    const aiMessage = aiRes?.choices?.[0]?.message?.content;
    if (!aiMessage) {
      return res.status(502).json({ error: "AI did not return a response" });
    }

    let recommendations;
    try {
      recommendations = JSON.parse(aiMessage);
    } catch (e) {
      const jsonMatch = aiMessage.match(/\{[\s\S]*\}$/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI JSON response");
      }
    }

    return res.json(recommendations);
  } catch (err) {
    console.error("recommendation error:", err?.message ?? err);
    return res.status(500).json({ error: "Failed to get plant recommendations" });
  }
});

export default app;