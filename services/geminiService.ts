import { GoogleGenAI } from "@google/genai";
import { Person } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCharmAnalysis = async (person: Person): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Unable to connect to AI service. Please check API Key configuration.";

  const prompt = `
    You are a sophisticated fan-club president and aesthetics expert.
    Write a short, poetic, and captivating appreciation analysis (approx 100 words) for:
    
    Name: ${person.name}
    Type: ${person.mainCategory} (${person.subCategory})
    Group/Platform: ${person.groupName || person.platformName || 'N/A'}
    Key Traits: ${person.tags.join(', ')}
    MBTI: ${person.info.mbti || 'Unknown'}
    
    Focus on their unique vibe, visual charm, and why they are considered an "Ideal Type". 
    Tone: Elegant, admiring, slightly emotional but professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while generating the analysis. Please try again later.";
  }
};
