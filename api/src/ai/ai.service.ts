import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.logger.log(
        `Initializing Gemini AI with Key: ${apiKey.substring(0, 4)}...`,
      );
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn('GEMINI_API_KEY not found. AI features will be mocked.');
    }
  }

  async generateSummary(
    content: string,
    accessToken?: string,
  ): Promise<string> {
    // 1. If Access Token is provided, try to use it with REST API (User Quota)
    if (accessToken) {
      this.logger.log(
        `[AiService] Generating summary on behalf of authenticated user (Token available)`,
      );
      // Implementation for user-quota context would go here if needed
    }

    // 2. Fallback to Server API Key
    if (!this.genAI) {
      this.logger.warn('Generate Summary called but no API Key is available.');
      return 'Mock summary: This is a placeholder summary because no API key was provided.';
    }

    try {
      this.logger.log(
        `Generating summary for content length: ${content.length} (Server Key)`,
      );
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });
      // Improved prompt for better summaries
      const prompt = `You are an expert content curator. Please provide a compelling, concise summary (max 2 sentences) of the following content. Capture the main idea and key insight. Content: ${content}`;

      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();

      if (!generatedText) {
        throw new Error('Gemini returned an empty response');
      }

      return generatedText.trim();
    } catch (error) {
      this.logger.error('Failed to generate summary with Gemini', error);
      throw error;
    }
  }

  async generateTags(content: string): Promise<string[]> {
    if (!this.genAI) {
      return ['General', 'Community']; // Fallback
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });
      const prompt = `Analyze the following content and generate 3-5 relevant, specific tags or keywords. 
      Focus on the main topics, technologies, or concepts discussed.
      Return ONLY a comma-separated list of tags (e.g., "React, Frontend, Web Development"). 
      Do not include explanations or hashtags.
      Content: "${content}"`;

      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();

      if (!generatedText) return [];

      return generatedText
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    } catch (error) {
      this.logger.error('Failed to generate tags with Gemini', error);
      return [];
    }
  }
}
