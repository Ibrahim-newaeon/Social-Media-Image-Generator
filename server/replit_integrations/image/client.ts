import { GoogleGenAI, Modality } from "@google/genai";

// Support both Replit's AI Integrations service and standard Google Gemini API key
const apiKey = process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

if (!apiKey) {
  console.warn("Warning: No GEMINI_API_KEY or AI_INTEGRATIONS_GEMINI_API_KEY found. Image generation will fail.");
}

// Configure for either Replit AI Integrations or standard Google AI
const aiConfig: any = { apiKey: apiKey };
if (baseUrl) {
  // Replit AI Integrations
  aiConfig.httpOptions = {
    apiVersion: "",
    baseUrl: baseUrl,
  };
} else {
  // Standard Google AI - use v1alpha API for image generation support
  aiConfig.httpOptions = {
    apiVersion: "v1alpha",
    baseUrl: "https://generativelanguage.googleapis.com",
  };
}

export const ai = new GoogleGenAI(aiConfig);

/**
 * Generate an image and return as base64 data URL.
 * Uses Gemini 2.0 Flash experimental model for image generation.
 */
export async function generateImage(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [{ role: "user", parts: [{ text: `Generate an image: ${prompt}` }] }],
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find(
    (part: any) => part.inlineData
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image data in response");
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  return `data:${mimeType};base64,${imagePart.inlineData.data}`;
}

