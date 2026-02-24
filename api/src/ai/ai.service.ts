import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;
  private _quotaExceeded = false;

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

  wasQuotaExceeded(): boolean {
    const val = this._quotaExceeded;
    this._quotaExceeded = false;
    return val;
  }

  async generateTags(content: string): Promise<string[]> {
    if (!this.genAI) {
      return this.extractKeywordsFallback(content);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `Analyze the following post and generate between 5 and 20 relevant topic tags.
Return ONLY a JSON array of short tag strings (1 to 3 words each). No explanation, no markdown, just the raw JSON array.
Aim for at least 5 tags that cover the main topics, themes, and concepts in the post.
IMPORTANT: Return tags in the SAME language as the post content. If the post is in Hebrew, return Hebrew tags. If in English, return English tags.
Example for English: ["machine learning", "python", "data science"]
Example for Hebrew: ["למידת מכונה", "פייתון", "מדע הנתונים"]

Post content: ${content}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/```json|```/g, '').trim();
      const tags = JSON.parse(text) as string[];

      if (!Array.isArray(tags)) throw new Error('Response is not an array');
      return tags.slice(0, 20).map((t) => t.toLowerCase().trim());
    } catch (error) {
      if (error instanceof Error && error.message.includes('429')) {
        this.logger.warn('Gemini daily quota exceeded — using keyword fallback for tags');
        this._quotaExceeded = true;
      } else {
        this.logger.error('Failed to generate tags with Gemini', error);
      }
      return this.extractKeywordsFallback(content);
    }
  }

  async expandSearchQuery(query: string): Promise<string[]> {
    if (!this.genAI) {
      return query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `Given this search query, generate 10 to 20 relevant topic tags that would help find related posts.
Return ONLY a JSON array of short tag strings (1 to 3 words each). No explanation, no markdown, just the raw JSON array.
IMPORTANT: Return tags in the SAME language as the search query. If the query is in Hebrew, return Hebrew tags.
Example for English: ["study tips", "learning", "focus", "productivity", "exam prep"]
Example for Hebrew: ["טיפים ללימוד", "למידה", "ריכוז", "פרודוקטיביות", "הכנה לבחינות"]

Search query: ${query}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/```json|```/g, '').trim();
      const tags = JSON.parse(text) as string[];

      if (!Array.isArray(tags)) throw new Error('Response is not an array');
      return tags.slice(0, 20).map((t) => t.toLowerCase().trim());
    } catch (error) {
      this.logger.error('Failed to expand search query with Gemini', error);
      return query.split(/\s+/).filter((w) => w.length > 1);
    }
  }

  extractKeywordsFallback(content: string): string[] {
    const stopWords = new Set([
      'about', 'there', 'their', 'would', 'could', 'should', 'which',
      'these', 'those', 'where', 'while', 'after', 'before', 'other',
      'every', 'first', 'being', 'since', 'under', 'until', 'using',
    ]);
    const words = content
      .toLowerCase()
      .replace(/[^\p{L}\s]/gu, '') // \p{L} matches any Unicode letter including Hebrew
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));
    return [...new Set(words)].slice(0, 5);
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.genAI) {
      return [];
    }
    try {
      const model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      this.logger.error('Failed to generate embedding', error);
      return [];
    }
  }

  async generateSummary(
    content: string,
    accessToken?: string,
  ): Promise<string> {
    if (accessToken) {
      this.logger.log(
        `[AiService] Generating summary on behalf of authenticated user (Token available)`,
      );
    } else {
      this.logger.log(
        `[AiService] Generating summary for anonymous/system request`,
      );
    }

    if (!this.genAI) {
      this.logger.warn('Generate Summary called but no API Key is available.');
      return 'Mock summary: This is a placeholder summary because no API key was provided.';
    }

    try {
      this.logger.log(
        `Generating summary for content length: ${content.length} (Server Key)`,
      );
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
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
