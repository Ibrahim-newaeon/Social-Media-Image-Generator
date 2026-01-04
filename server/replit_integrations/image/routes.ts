import type { Express, Request, Response } from "express";
import { Modality } from "@google/genai";
import { ai } from "./client";

interface BrandStyleInput {
  brandName?: string;
  primaryColors?: string;
  secondaryColors?: string;
  fontStyle?: string;
  visualStyle?: string;
  additionalNotes?: string;
  targetAudience?: string;
}

export function registerImageRoutes(app: Express): void {
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
        model: "gemini-2.5-flash-preview-05-20",
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

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      const candidate = response.candidates?.[0];
      const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);

      if (!imagePart?.inlineData?.data) {
        return res.status(500).json({ error: "No image data in response" });
      }

      const mimeType = imagePart.inlineData.mimeType || "image/png";
      res.json({
        b64_json: imagePart.inlineData.data,
        mimeType,
      });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });
}

