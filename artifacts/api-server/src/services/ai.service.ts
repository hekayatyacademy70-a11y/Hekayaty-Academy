import { GoogleGenAI } from "@google/genai";

export class AiService {
  private ai: GoogleGenAI | null = null;
  private isConfigured = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("AiService: GEMINI_API_KEY not configured. AI features will run in mock mode.");
      return;
    }

    try {
      this.ai = new GoogleGenAI({ apiKey });
      this.isConfigured = true;
    } catch (error) {
      console.error("AiService: Failed to initialize Gemini API", error);
    }
  }

  /**
   * Generates text based on a prompt.
   * If not configured, returns a mock response after a short delay.
   */
  async generateText(prompt: string, context?: string): Promise<string> {
    if (!this.isConfigured || !this.ai) {
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 1500));
      return `[Mock AI Response]\n\nبناءً على طلبك: "${prompt}"\n\nهذا نص تجريبي يتم توليده لأن مفتاح GEMINI_API_KEY غير متوفر في إعدادات الخادم. بمجرد إضافة المفتاح، سيتم ربط هذه الميزة مباشرة بنموذج الذكاء الاصطناعي الحقيقي لتوليد نصوص إبداعية وأفكار رائعة لمساعدتك في كتابة روايتك.`;
    }

    const fullPrompt = context 
      ? `السياق الحالي للرواية/الفصل:\n${context}\n\nطلب الكاتب:\n${prompt}`
      : prompt;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          temperature: 0.7,
        }
      });
      return response.text || "";
    } catch (error) {
      console.error("AiService error:", error);
      throw new Error("Failed to generate AI content");
    }
  }
}
