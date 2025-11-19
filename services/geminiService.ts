import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

export const extractTextFromImage = async (base64Image: string, mimeType: string = 'image/png'): Promise<string> => {
  if (!apiKey) {
    console.error("API Key is missing");
    return "Error: API Key is missing. Please check your environment variables.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "You are an advanced OCR engine acting as the Ground Truth. Please extract all visible text from this image accurately. Preserve line breaks and spacing where semantic. Do not add markdown blocks or introductory text, just return the raw extracted content."
          },
        ],
      },
    });

    return response.text || "No text detected.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error processing image with OCR engine.";
  }
};