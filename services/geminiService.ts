
import { GoogleGenAI, Type } from "@google/genai";

export interface WithdrawalAnalysis {
  summary: string;
  category: string;
}

export const analyzeWithdrawalReason = async (reason: string): Promise<WithdrawalAnalysis> => {
  try {
    if (!process.env.API_KEY) {
      console.warn("API_KEY not found. Returning mock data.");
      return {
          summary: "AI analysis is disabled. This is a mock summary.",
          category: "Mock Category",
      };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Analyze the following withdrawal request for a community fund. Summarize it concisely in one sentence and suggest a category from this list: 'Supplies', 'Event Costs', 'Utilities', 'Services', 'Rent', 'Food & Beverage', 'Travel', 'Miscellaneous'.
    
    Request: "${reason}"
    
    Return the result as a clean JSON object.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A one-sentence summary of the withdrawal reason."
            },
            category: {
              type: Type.STRING,
              description: "A suggested category for the expense."
            }
          },
          required: ["summary", "category"],
        }
      }
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as WithdrawalAnalysis;

  } catch (error) {
    console.error("Error analyzing withdrawal reason with Gemini API:", error);
    // Fallback to a default response in case of API error
    return {
      summary: "Could not analyze reason. Please summarize manually.",
      category: "Miscellaneous",
    };
  }
};
