import type { Express, Request, Response } from "express";
import { GoogleGenAI, Modality } from "@google/genai";
import OpenAI from "openai";
import { ai, generateImage } from "./client";

// Initialize OpenAI client for DALL-E image generation
const openaiApiKey = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;

if (openaiApiKey) {
  openai = new OpenAI({ apiKey: openaiApiKey });
} else {
  console.warn("Warning: No OPENAI_API_KEY found. Image generation will fail.");
}

interface BrandStyleInput {
  brandName?: string;
  primaryColors?: string;
  secondaryColors?: string;
  fontStyle?: string;
  visualStyle?: string;
  additionalNotes?: string;
  targetAudience?: string;
}

interface AnalysisOptions {
  analyzeColors: boolean;
  analyzeStyle: boolean;
  analyzeComposition: boolean;
  analyzeMood: boolean;
}

export function registerImageRoutes(app: Express): void {
  // Analyze reference images for style extraction
  app.post("/api/analyze-reference", async (req: Request, res: Response) => {
    try {
      const { images, options } = req.body as {
        images: string[]; // Array of base64 data URLs
        options: AnalysisOptions;
      };

      if (!images || images.length === 0) {
        return res.status(400).json({ error: "At least one image is required" });
      }

      // Build the analysis prompt based on options
      const analysisRequests: string[] = [];
      if (options.analyzeColors) {
        analysisRequests.push("- Extract the dominant color palette (list 4-6 hex color codes)");
      }
      if (options.analyzeStyle) {
        analysisRequests.push("- Describe the visual style (e.g., minimalist, luxury, rustic, modern, vintage, etc.) in 1-2 sentences");
      }
      if (options.analyzeComposition) {
        analysisRequests.push("- Describe the composition and layout approach (e.g., centered, rule of thirds, negative space usage) in 1-2 sentences");
      }
      if (options.analyzeMood) {
        analysisRequests.push("- Describe the mood and atmosphere (e.g., warm, professional, playful, elegant) in 1-2 sentences");
      }

      const prompt = `Analyze the following reference image(s) for use in generating similar styled images.

Please extract the following attributes:
${analysisRequests.join("\n")}

Also provide a brief overall summary (1-2 sentences) that captures the essential visual identity.

IMPORTANT: Return your response in this exact JSON format:
{
  "colors": ["#hex1", "#hex2", ...],
  "style": "description of visual style",
  "composition": "description of composition",
  "mood": "description of mood",
  "summary": "brief overall summary"
}

Only include fields that were requested. Return valid JSON only, no additional text.`;

      // Prepare image parts for the API
      const imageParts = images.map((dataUrl: string) => {
        // Extract base64 data from data URL
        const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) {
          throw new Error("Invalid image data URL format");
        }
        return {
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          },
        };
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              ...imageParts,
              { text: prompt },
            ],
          },
        ],
      });

      const textPart = response.candidates?.[0]?.content?.parts?.[0];
      if (!textPart || typeof (textPart as any).text !== "string") {
        return res.status(500).json({ error: "Failed to analyze images" });
      }

      // Parse the JSON response
      let analysisText = (textPart as any).text.trim();

      // Remove markdown code blocks if present
      if (analysisText.startsWith("```json")) {
        analysisText = analysisText.slice(7);
      }
      if (analysisText.startsWith("```")) {
        analysisText = analysisText.slice(3);
      }
      if (analysisText.endsWith("```")) {
        analysisText = analysisText.slice(0, -3);
      }
      analysisText = analysisText.trim();

      try {
        const analysis = JSON.parse(analysisText);
        res.json({
          colors: analysis.colors || [],
          style: analysis.style || "",
          composition: analysis.composition || "",
          mood: analysis.mood || "",
          summary: analysis.summary || "Style extracted from reference images",
        });
      } catch (parseError) {
        console.error("Failed to parse analysis response:", analysisText);
        res.status(500).json({ error: "Failed to parse analysis response" });
      }
    } catch (error) {
      console.error("Error analyzing reference images:", error);
      res.status(500).json({ error: "Failed to analyze reference images" });
    }
  });

  // Generate AI-powered prompt suggestions based on brand guidelines
  app.post("/api/suggest-prompts", async (req: Request, res: Response) => {
    try {
      const brandStyle: BrandStyleInput = req.body.brandStyle || {};
      const count = Math.min(Math.max(req.body.count || 10, 1), 20);

      // Build context from brand guidelines
      const contextParts: string[] = [];
      if (brandStyle.brandName) contextParts.push(`Brand: ${brandStyle.brandName}`);
      if (brandStyle.primaryColors) contextParts.push(`Primary colors: ${brandStyle.primaryColors}`);
      if (brandStyle.secondaryColors) contextParts.push(`Secondary colors: ${brandStyle.secondaryColors}`);
      if (brandStyle.fontStyle) contextParts.push(`Typography: ${brandStyle.fontStyle}`);
      if (brandStyle.visualStyle) contextParts.push(`Visual style: ${brandStyle.visualStyle}`);
      if (brandStyle.additionalNotes) contextParts.push(`Additional notes: ${brandStyle.additionalNotes}`);
      if (brandStyle.targetAudience) contextParts.push(`Target audience: ${brandStyle.targetAudience}`);

      const brandContext = contextParts.length > 0
        ? `Brand Guidelines:\n${contextParts.join("\n")}\n\n`
        : "";

      const systemPrompt = `You are a creative director specializing in social media imagery for brands. Generate exactly ${count} unique, detailed image prompts for social media posts.

${brandContext}Each prompt should:
1. Be a complete, detailed image description (50-150 words)
2. Include specific visual elements, lighting, composition, and mood
3. Be suitable for social media marketing
4. Reflect the brand's identity and appeal to the target audience
5. Cover different scenarios: product shots, lifestyle imagery, behind-the-scenes, seasonal themes, etc.

Return ONLY the prompts, one per line. Do not number them or add any other text.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      });

      const text = response.candidates?.[0]?.content?.parts?.[0];
      if (!text || typeof (text as any).text !== "string") {
        return res.status(500).json({ error: "Failed to generate suggestions" });
      }

      const prompts = (text as any).text
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .slice(0, count);

      res.json({ prompts });
    } catch (error) {
      console.error("Error generating prompt suggestions:", error);
      res.status(500).json({ error: "Failed to generate prompt suggestions" });
    }
  });

  app.post("/api/generate-image", async (req: Request, res: Response) => {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Use Google Gemini for image generation
      const imageDataUrl = await generateImage(prompt);

      // Extract base64 data from data URL
      const matches = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return res.status(500).json({ error: "Invalid image data format" });
      }

      res.json({
        b64_json: matches[2],
        mimeType: matches[1],
      });
    } catch (error: any) {
      console.error("Error generating image:", error);
      const errorMessage = error?.message || "Failed to generate image";
      res.status(500).json({ error: errorMessage });
    }
  });
}

