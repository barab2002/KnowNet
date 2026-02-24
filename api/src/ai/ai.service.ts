import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;
  private groq: Groq;
  private _quotaExceeded = false;

  constructor() {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      this.logger.log(`Initializing Gemini AI with Key: ${geminiKey.substring(0, 4)}...`);
      this.genAI = new GoogleGenerativeAI(geminiKey);
    } else {
      this.logger.warn('GEMINI_API_KEY not found. Embeddings and search expansion will be unavailable.');
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      this.logger.log(`Initializing Groq with Key: ${groqKey.substring(0, 4)}...`);
      this.groq = new Groq({ apiKey: groqKey });
    } else {
      this.logger.warn('GROQ_API_KEY not found. Tag generation will use keyword fallback.');
    }
  }

  wasQuotaExceeded(): boolean {
    const val = this._quotaExceeded;
    this._quotaExceeded = false;
    return val;
  }

  async generateTags(content: string): Promise<string[]> {
    if (!this.groq) {
      return this.extractKeywordsFallback(content);
    }

    const prompt = `You are tagging posts for a student knowledge-sharing platform. Generate 10 to 30 high-quality search tags for the post below.

Think across these categories to ensure good coverage:
1. Academic field / subject (e.g. "mathematics", "computer science", "biology", "history")
2. Specific topic (e.g. "derivatives", "binary search", "photosynthesis", "world war 2")
3. Parent / related concepts — CRITICAL: if the post is about geometry, also add "math"; if about sorting algorithms, also add "programming" and "computer science"
4. Content type (e.g. "study tip", "exam prep", "homework help", "explanation", "summary", "question")
5. Practical context (e.g. "university", "high school", "beginner", "finals", "deadline")

Rules:
- Each tag must be 1 to 3 words, lowercase
- Include BOTH specific tags AND their broad parent fields — most important rule for search quality
- No filler tags like "post", "content", "topic", "information"
- Return ONLY a raw JSON array of strings — no explanation, no markdown, no code block

IMPORTANT: Return tags in the SAME language as the post. Hebrew post → Hebrew tags. English post → English tags.

Post content:
${content}`;

    try {
      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });

      const text = completion.choices[0]?.message?.content?.trim().replace(/```json|```/g, '').trim();
      const tags = JSON.parse(text) as string[];

      if (!Array.isArray(tags)) throw new Error('Response is not an array');
      this.logger.log(`Generated ${tags.length} tags via Groq`);
      return tags.slice(0, 30).map((t) => t.toLowerCase().trim());
    } catch (error) {
      if (error instanceof Error && error.message.includes('429')) {
        this.logger.warn('Groq rate limit hit — using keyword fallback for tags');
        this._quotaExceeded = true;
      } else {
        this.logger.error('Failed to generate tags with Groq', error);
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
      const prompt = `Given this search query, generate 15 to 25 relevant topic tags that would help find related posts in a student knowledge-sharing app.
Include BOTH broad concepts AND specific terms. Prefer short 1-2 word tags over long phrases, since tags on posts are usually short.
Return ONLY a JSON array of lowercase tag strings. No explanation, no markdown, just the raw JSON array.
IMPORTANT: Return tags in the SAME language as the search query. If the query is in Hebrew, return Hebrew tags.
Example for English: ["study", "studying", "study tips", "learning", "focus", "productivity", "exam", "exam prep", "notes", "homework"]
Example for Hebrew: ["לימוד", "טיפים ללימוד", "מבחנים", "ריכוז", "פרודוקטיביות", "שיעורי בית"]

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
    return [...new Set(words)].slice(0, 10);
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
    if (!this.genAI) {
      return 'No API key configured — summary unavailable.';
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `You are a helpful assistant. Please provide a concise, one-sentence summary of the following content: ${content}`;

      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();

      if (!generatedText) throw new Error('empty response');

      this.logger.log('Summary generated successfully');
      return generatedText;
    } catch (error) {
      if (error instanceof Error && error.message.includes('429')) {
        this.logger.warn('Gemini quota exceeded on summary generation');
        this._quotaExceeded = true;
        throw new HttpException(
          'AI quota exceeded — daily limit reached. Try again tomorrow.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      this.logger.error('Failed to generate summary', error);
      throw new HttpException(
        'Failed to generate summary. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
