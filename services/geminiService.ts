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
  if (!ai) return "AI 서비스에 연결할 수 없습니다. API 키 설정을 확인해주세요.";

  const prompt = `
    당신은 안목이 뛰어난 팬클럽 회장이자 미학 전문가입니다.
    다음 인물에 대해 짧고(약 100자 내외), 시적이며, 마음을 사로잡는 '입덕 포인트' 분석글을 작성해주세요. 한국어로 작성해야 합니다.
    
    이름: ${person.name}
    분류: ${person.mainCategory} (${person.subCategory})
    그룹/활동처: ${person.groupName || person.platformName || 'N/A'}
    키워드: ${person.tags.join(', ')}
    MBTI: ${person.info.mbti || '알 수 없음'}
    
    이 사람만의 독보적인 분위기, 비주얼적 매력, 그리고 왜 이 사람이 "이상형"일 수밖에 없는지에 대해 작성하세요.
    어조: 우아하고, 감탄하며, 약간은 주접스럽지만 세련된 톤으로 (트위터나 블로그 감성).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "분석을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "분석 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};