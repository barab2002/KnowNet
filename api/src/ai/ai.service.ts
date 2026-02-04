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

  async generateSummary(content: string): Promise<string> {
    if (!this.genAI) {
      this.logger.warn('Generate Summary called but no API Key is available.');
      return 'Mock summary: This is a placeholder summary because no API key was provided.';
    }

    try {
      this.logger.log(
        `Generating summary for content length: ${content.length}`,
      );
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });
      const prompt = `You are a helpful assistant. Please provide a concise, one-sentence summary of the following content: ${content}`;

      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();
      this.logger.log('Summary generated successfully');

      return generatedText || '';
    } catch (error) {
      this.logger.error('Failed to generate summary with Gemini', error);
      if (error instanceof Error) {
        this.logger.error(`Error details: ${error.message}`);
        this.logger.error(error.stack);
      }
      return '';
    }
  }
}
