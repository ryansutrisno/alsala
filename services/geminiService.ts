import { GoogleGenAI, Type } from "@google/genai";
import { InspirationContent } from '../types';

export const getDailyInspiration = async (prayerName: string): Promise<InspirationContent | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key not found for Gemini.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Provide a short, inspiring Islamic quote or Hadith relevant to the time of ${prayerName} or general patience/gratitude. Also provide a very brief reflection (under 20 words). Response must be in Indonesian.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            source: { type: Type.STRING },
            reflection: { type: Type.STRING }
          },
          required: ["quote", "source", "reflection"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as InspirationContent;
    }
    return null;

  } catch (error) {
    console.error("Error fetching inspiration from Gemini:", error);
    return {
      quote: "Maka sesungguhnya bersama kesulitan ada kemudahan.",
      source: "QS. Al-Insyirah: 5",
      reflection: "Tetaplah bersabar dan berusaha."
    };
  }
};
