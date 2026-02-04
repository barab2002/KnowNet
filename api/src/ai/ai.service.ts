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
    // 1. Log the context (User Quota not used to avoid scope verification issues)
    if (accessToken) {
      this.logger.log(
        `[AiService] Generating summary on behalf of authenticated user (Token available)`,
      );
    } else {
      this.logger.log(
        `[AiService] Generating summary for anonymous/system request`,
      );
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
        model: 'gemini-2.5-flash',
      });
      const prompt = `You are a helpful assistant. Please provide a concise, one-sentence summary of the following content: ${content}`;

      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();

      if (!generatedText) {
        throw new Error('Gemini returned an empty response');
      }

      this.logger.log('Summary generated successfully');
      return generatedText;
    } catch (error) {
      this.logger.error('Failed to generate summary with Gemini', error);
      if (error instanceof Error) {
        this.logger.error(`Error details: ${error.message}`);
        throw new Error(`AI Error: ${error.message}`);
      }
      throw new Error('AI Error: Unknown failure');
    }
  }
}
