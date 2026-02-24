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

  async generateTags(content: string): Promise<string[]> {
    if (!this.genAI) {
      return this.extractKeywordsFallback(content);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Analyze the following post and generate between 5 and 20 relevant topic tags.
Return ONLY a JSON array of short, lowercase tag strings (1 to 3 words each). No explanation, no markdown, just the raw JSON array.
Aim for at least 5 tags that cover the main topics, themes, and concepts in the post.
Example: ["machine learning", "python", "data science", "neural networks", "deep learning"]

Post content: ${content}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/```json|```/g, '').trim();
      const tags = JSON.parse(text) as string[];

      if (!Array.isArray(tags)) throw new Error('Response is not an array');
      return tags.slice(0, 20).map((t) => t.toLowerCase().trim());
    } catch (error) {
      this.logger.error('Failed to generate tags with Gemini', error);
      return this.extractKeywordsFallback(content);
    }
  }

  async expandSearchQuery(query: string): Promise<string[]> {
    if (!this.genAI) {
      return query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Given this search query, generate 10 to 20 relevant topic tags that would help find related posts.
Return ONLY a JSON array of short, lowercase tag strings (1 to 3 words each). No explanation, no markdown, just the raw JSON array.
Example: for "how to study better" return ["study tips", "studying", "learning", "focus", "productivity", "academic", "exam prep", "time management", "memory", "concentration"]

Search query: ${query}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/```json|```/g, '').trim();
      const tags = JSON.parse(text) as string[];

      if (!Array.isArray(tags)) throw new Error('Response is not an array');
      return tags.slice(0, 20).map((t) => t.toLowerCase().trim());
    } catch (error) {
      this.logger.error('Failed to expand search query with Gemini', error);
      return query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    }
  }

  private extractKeywordsFallback(content: string): string[] {
    const stopWords = new Set([
      'about', 'there', 'their', 'would', 'could', 'should', 'which',
      'these', 'those', 'where', 'while', 'after', 'before', 'other',
      'every', 'first', 'being', 'since', 'under', 'until', 'using',
    ]);
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 4 && !stopWords.has(w));
    return [...new Set(words)].slice(0, 5);
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
