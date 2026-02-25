import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

export const TAG_MODELS = [
  {
    id: 'llama-3.3-70b-versatile',
    label: 'Llama 3.3 70B',
    provider: 'groq',
    description: 'Best quality',
  },
  {
    id: 'llama-3.1-8b-instant',
    label: 'Llama 3.1 8B',
    provider: 'groq',
    description: 'Fastest',
  },
  {
    id: 'gemini-2.0-flash',
    label: 'Gemini Flash',
    provider: 'gemini',
    description: 'Google',
  },
] as const;

export type TagModelId = (typeof TAG_MODELS)[number]['id'];
export const DEFAULT_TAG_MODEL: TagModelId = 'llama-3.3-70b-versatile';

export const SUMMARY_MODELS = [
  {
    id: 'llama-3.3-70b-versatile',
    label: 'Llama 3.3 70B',
    provider: 'groq',
    description: 'Best quality',
  },
  {
    id: 'llama-3.1-8b-instant',
    label: 'Llama 3.1 8B',
    provider: 'groq',
    description: 'Fastest',
  },
  {
    id: 'gemini-2.0-flash',
    label: 'Gemini Flash',
    provider: 'gemini',
    description: 'Google',
  },
] as const;

export type SummaryModelId = (typeof SUMMARY_MODELS)[number]['id'];
export const DEFAULT_SUMMARY_MODEL: SummaryModelId = 'llama-3.3-70b-versatile';

const TAXONOMIST_SYSTEM = `You are an expert content taxonomist for KnowNet, a student knowledge platform.
Your task is to extract highly relevant, search-optimized tags from the following post content.

Rules (follow all strictly):
- Extract 5–12 meaningful tags that describe core concepts, academic subjects, and specific entities.
- Each tag: 1–3 words, lowercase. Use hyphens for multi-word phrases (e.g., "machine-learning", "linear-algebra").
- Be SPECIFIC: Prefer "quadratic-equations" over "math", "cellular-respiration" over "biology".
- Language: Return tags in the SAME language as the post. Hebrew post → Hebrew tags.
- Avoid generic noise: Do NOT include "post", "text", "summary", "explanation", "info", "learning", "study", "the", "a".
- Output ONLY a valid JSON array of strings. No prose, no markdown code fences.

Example Good Tags:
- English: ["calculus", "derivatives", "chain-rule", "university-level"]
- Hebrew: ["חשבון-דיפרנציאלי", "נגזרות", "כלל-השרשרת", "אקדמיה"]`;

function extractJsonArray(raw: string): string[] {
  try {
    // Try to find the first array in the response, handling markdown fences
    const cleaned = raw
      .trim()
      .replace(/```json|```/g, '')
      .trim();
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No JSON array pattern found');

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed))
      throw new Error('Parsed result is not an array');

    return parsed
      .map((t) => String(t).toLowerCase().trim())
      .filter((t) => t.length > 1);
  } catch (error) {
    throw new Error(
      `Failed to parse AI response as JSON array: ${error.message}. Raw: ${raw.substring(0, 100)}`,
    );
  }
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;
  private groq: Groq;
  private _quotaExceeded = false;

  constructor() {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      this.logger.log(
        `Initializing Gemini AI with Key: ${geminiKey.substring(0, 4)}...`,
      );
      this.genAI = new GoogleGenerativeAI(geminiKey);
    } else {
      this.logger.warn(
        'GEMINI_API_KEY not found. Embeddings and search expansion will be unavailable.',
      );
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      this.logger.log(
        `Initializing Groq with Key: ${groqKey.substring(0, 4)}...`,
      );
      this.groq = new Groq({ apiKey: groqKey });
    } else {
      this.logger.warn(
        'GROQ_API_KEY not found. Tag generation will use keyword fallback.',
      );
    }
  }

  wasQuotaExceeded(): boolean {
    const val = this._quotaExceeded;
    this._quotaExceeded = false;
    return val;
  }

  async generateTags(
    content: string,
    model: TagModelId = DEFAULT_TAG_MODEL,
  ): Promise<string[]> {
    try {
      const modelInfo = TAG_MODELS.find((m) => m.id === model);
      if (modelInfo?.provider === 'gemini') {
        return await this.generateTagsGemini(content, model);
      }
      return await this.generateTagsGroq(content, model);
    } catch (error) {
      this.logger.error('Tag generation failed, using keyword fallback', error);
      return this.extractKeywordsFallback(content);
    }
  }

  private async generateTagsGroq(
    content: string,
    model: string,
  ): Promise<string[]> {
    if (!this.groq) return this.extractKeywordsFallback(content);

    const completion = await this.groq.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: TAXONOMIST_SYSTEM },
        { role: 'user', content: `Post to analyze:\n${content}` },
      ],
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content ?? '';
    this.logger.debug(`Groq raw response (${model}): ${raw.substring(0, 300)}`);
    const tags = extractJsonArray(raw);
    const cleanedTags = this.postProcessTags(tags);
    this.logger.log(`Generated ${cleanedTags.length} tags via Groq (${model})`);
    return cleanedTags;
  }

  private async generateTagsGemini(
    content: string,
    model: string,
  ): Promise<string[]> {
    if (!this.genAI) return this.extractKeywordsFallback(content);

    const geminiModel = this.genAI.getGenerativeModel({ model });
    const prompt = `${TAXONOMIST_SYSTEM}\n\nPost to analyze:\n${content}`;
    const result = await geminiModel.generateContent(prompt);
    const raw = result.response.text();
    this.logger.debug(
      `Gemini raw response (${model}): ${raw.substring(0, 300)}`,
    );
    const tags = extractJsonArray(raw);
    const cleanedTags = this.postProcessTags(tags);
    this.logger.log(
      `Generated ${cleanedTags.length} tags via Gemini (${model})`,
    );
    return cleanedTags;
  }

  private postProcessTags(tags: string[]): string[] {
    const genericNoise = new Set([
      'post',
      'text',
      'content',
      'info',
      'information',
      'summary',
      'explanation',
      'study',
      'learning',
      'homework',
      'question',
      'answer',
      'assignment',
      'the',
      'this',
      'that',
      'and',
      'with',
      'from',
      'also',
      'actually',
    ]);

    const words: string[] = [];
    for (const t of tags) {
      const cleaned = t.toLowerCase().replace(/[\.#,;:"'()[\]{}]/g, '').trim();
      // Split multi-word tags (spaces or hyphens) into individual words
      const split = cleaned.split(/[\s\-_]+/).filter(Boolean);
      words.push(...split);
    }

    return [
      ...new Set(
        words
          .filter((w) => w.length > 2 && w.length < 30)
          .filter((w) => !genericNoise.has(w))
          .filter((w) => /^[\p{L}\d]+$/u.test(w)), // letters and digits only
      ),
    ].slice(0, 25);
  }

  async expandSearchQuery(query: string): Promise<string[]> {
    if (!this.genAI)
      return query
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 2);

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
      });
      const prompt = `You are a search expansion engine for KnowNet. Given the query "${query}", generate a JSON array of 10-15 keywords and concepts that are semantically related.
Include synonyms, broader categories, and closely linked entities. 
Example query: "fish" -> expansion: ["sea", "ocean", "marine-biology", "water", "aquarium", "scales", "swimming", "ecology", "nature"]
Example query: "math" -> expansion: ["algebra", "calculus", "numbers", "geometry", "equations", "problem-solving", "arithmetic"]
Rules:
1. Return ONLY a JSON array of strings.
2. Return terms in the SAME language as the query (Hebrew query -> Hebrew expansion).
3. Be creative: look for latent connections.`;

      const result = await model.generateContent(prompt);
      const text = result.response
        .text()
        .trim()
        .replace(/```json|```/g, '')
        .trim();
      const tags = JSON.parse(text) as string[];
      if (!Array.isArray(tags)) throw new Error('Response is not an array');
      return [...new Set(tags.slice(0, 15).map((t) => t.toLowerCase().trim()))];
    } catch (error) {
      this.logger.error('Failed to expand search query with Gemini', error);
      return query
        .split(/\s+/)
        .filter((w) => w.length > 1)
        .map((w) => w.toLowerCase());
    }
  }

  extractKeywordsFallback(content: string): string[] {
    const stopWords = new Set([
      // English
      'about',
      'there',
      'their',
      'would',
      'could',
      'should',
      'which',
      'these',
      'those',
      'where',
      'while',
      'after',
      'before',
      'other',
      'every',
      'first',
      'being',
      'since',
      'under',
      'until',
      'using',
      'the',
      'and',
      'with',
      'from',
      'also',
      'actually',
      'known',
      'this',
      'that',
      'for',
      'was',
      'were',
      'been',
      'has',
      'have',
      'had',
      // Hebrew
      'את',
      'של',
      'על',
      'הוא',
      'היא',
      'הם',
      'הן',
      'זה',
      'זו',
      'אלה',
      'אלו',
      'גם',
      'או',
      'כי',
      'עם',
      'כל',
      'רק',
      'עד',
      'אל',
      'אבל',
      'כבר',
      'בין',
      'מה',
      'מי',
      'איך',
      'מתי',
      'כמה',
      'יש',
      'אין',
      'כמו',
      'אחרי',
      'לפני',
    ]);

    const words = content
      .toLowerCase()
      .replace(/[^\p{L}\d\s]/gu, ' ') // keep letters and digits, replace others with space
      .split(/\s+/)
      .filter((w) => {
        if (w.length <= 2) return false;
        if (stopWords.has(w)) return false;
        if (/^\d+$/.test(w)) return false; // skip pure numbers
        return true;
      });

    // Rank by length as a simple heuristic for "importance" (longer words are often more specific)
    const uniqueWords = [...new Set(words)];
    return uniqueWords.sort((a, b) => b.length - a.length).slice(0, 12);
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.genAI) return [];
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'text-embedding-004',
      });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      this.logger.error('Failed to generate embedding', error);
      return [];
    }
  }

  async generateSummary(
    content: string,
    model: SummaryModelId = DEFAULT_SUMMARY_MODEL,
  ): Promise<string> {
    const modelInfo = SUMMARY_MODELS.find((m) => m.id === model);
    if (modelInfo?.provider === 'groq') {
      return this.generateSummaryGroq(content, model);
    }
    return this.generateSummaryGemini(content, model);
  }

  private async generateSummaryGemini(
    content: string,
    model: string,
  ): Promise<string> {
    if (!this.genAI) {
      return 'No API key configured — summary unavailable.';
    }

    try {
      const geminiModel = this.genAI.getGenerativeModel({ model });
      const prompt = `You are a helpful assistant. Please provide a concise, one-sentence summary of the following content: ${content}`;
      const result = await geminiModel.generateContent(prompt);
      const generatedText = result.response.text();
      if (!generatedText) throw new Error('empty response');
      this.logger.log(`Summary generated successfully via Gemini (${model})`);
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
      this.logger.error('Failed to generate summary via Gemini', error);
      throw new HttpException(
        'Failed to generate summary. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async generateSummaryGroq(
    content: string,
    model: string,
  ): Promise<string> {
    if (!this.groq) {
      return 'No Groq API key configured — summary unavailable.';
    }

    try {
      const completion = await this.groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: `You are a helpful assistant. Please provide a concise, one-sentence summary of the following content: ${content}`,
          },
        ],
        temperature: 0.3,
      });
      const generatedText = completion.choices[0]?.message?.content ?? '';
      if (!generatedText) throw new Error('empty response');
      this.logger.log(`Summary generated successfully via Groq (${model})`);
      return generatedText;
    } catch (error) {
      this.logger.error('Failed to generate summary via Groq', error);
      throw new HttpException(
        'Failed to generate summary. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
