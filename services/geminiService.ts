
import { GoogleGenAI, Type } from "@google/genai";

// Instancie GoogleGenAI dentro das funções para garantir que process.env.API_KEY esteja atualizado
export const getTicketAnalysisInsight = async (ticketDescription: string, solutionSummary: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Como um agente de monitoramento de desenvolvedores de IA, analise a seguinte correção e forneça um resumo executivo de 2 frases do que foi resolvido. RESPONDA EM PORTUGUÊS (PT-BR).
            Ticket: ${ticketDescription}
            Solução Aplicada: ${solutionSummary}`,
            config: {
                systemInstruction: "Você é um líder técnico sênior monitorando um agente de depuração autônomo. Resuma as correções de forma concisa em português para um painel de controle.",
                temperature: 0.7,
            }
        });
        return response.text || "Falha ao gerar insight.";
    } catch (error) {
        console.error("Erro na Análise Gemini:", error);
        return "Falha ao gerar insight.";
    }
};

export const getRiskAssessment = async (ticketDescription: string, codeDiff: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Avalie o risco técnico desta correção de código para o seguinte problema:
            Problema: ${ticketDescription}
            Correção: ${codeDiff}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER, description: "Pontuação de segurança de 0 a 100" },
                        level: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
                        sideEffects: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Efeitos colaterais em português" },
                        recommendation: { type: Type.STRING, description: "Recomendação em português" }
                    },
                    required: ["score", "level", "sideEffects", "recommendation"]
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        return null;
    }
};

export const getTroubleshootingGuide = async (errorDetails: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `O seguinte erro ocorreu durante a correção autônoma: ${errorDetails}. Sugira 3 possíveis causas técnicas e correções para um desenvolvedor analisar. RESPONDA EM PORTUGUÊS (PT-BR).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        causes: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["causes", "suggestions"]
                }
            }
        });
        const text = response.text;
        return text ? JSON.parse(text) : null;
    } catch (error) {
        return null;
    }
}
