import { AiService, DEFAULT_SUMMARY_MODEL } from './ai.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

jest.mock('@google/generative-ai');
jest.mock('groq-sdk', () => {
  const mockCreate = jest.fn();
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: { completions: { create: mockCreate } },
    })),
    _mockCreate: mockCreate,
  };
});

import Groq from 'groq-sdk';

function getGroqMockCreate(): jest.Mock {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('groq-sdk')._mockCreate as jest.Mock;
}

describe('AiService', () => {
  let service: AiService;
  let mockGeminiContent: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGeminiContent = jest.fn();

    (GoogleGenerativeAI as jest.MockedClass<typeof GoogleGenerativeAI>).mockImplementation(
      () =>
        ({
          getGenerativeModel: jest.fn().mockReturnValue({
            generateContent: mockGeminiContent,
            embedContent: jest.fn().mockResolvedValue({ embedding: { values: [0.1, 0.2] } }),
          }),
        }) as any,
    );
  });

  // ── With both API keys ─────────────────────────────────────────────
  describe('with GEMINI_API_KEY and GROQ_API_KEY set', () => {
    beforeEach(() => {
      process.env.GEMINI_API_KEY = 'test-gemini-key';
      process.env.GROQ_API_KEY = 'test-groq-key';
      service = new AiService();
    });

    afterEach(() => {
      delete process.env.GEMINI_API_KEY;
      delete process.env.GROQ_API_KEY;
    });

    describe('generateTags (default model = Groq)', () => {
      it('should return parsed tags from Groq', async () => {
        getGroqMockCreate().mockResolvedValue({
          choices: [{ message: { content: '["machine-learning", "python", "data-science"]' } }],
        });

        const tags = await service.generateTags('A post about machine learning with Python');
        expect(tags).toBeInstanceOf(Array);
        expect(tags.length).toBeGreaterThan(0);
      });

      it('should strip markdown code fences from Groq response', async () => {
        getGroqMockCreate().mockResolvedValue({
          choices: [{ message: { content: '```json\n["tag1", "tag2", "tag3"]\n```' } }],
        });

        const tags = await service.generateTags('some content');
        expect(tags).toBeInstanceOf(Array);
        expect(tags).toContain('tag1');
      });

      it('should fall back to keyword extraction if Groq throws', async () => {
        getGroqMockCreate().mockRejectedValue(new Error('API Error'));

        const tags = await service.generateTags('learning python algorithms coding skills');
        expect(tags).toBeInstanceOf(Array);
        expect(tags.length).toBeGreaterThan(0);
      });

      it('should fall back to keyword extraction if response is not valid JSON', async () => {
        getGroqMockCreate().mockResolvedValue({
          choices: [{ message: { content: 'not valid json at all' } }],
        });

        const tags = await service.generateTags('learning about python algorithms');
        expect(tags).toBeInstanceOf(Array);
      });

      it('should use Gemini when gemini model is specified', async () => {
        mockGeminiContent.mockResolvedValue({
          response: { text: () => '["ai", "google", "gemini"]' },
        });

        const tags = await service.generateTags('content about AI', 'gemini-2.0-flash');
        expect(tags).toBeInstanceOf(Array);
        expect(mockGeminiContent).toHaveBeenCalled();
      });
    });

    describe('generateSummary (default model = Groq)', () => {
      it('should return summary from Groq by default', async () => {
        getGroqMockCreate().mockResolvedValue({
          choices: [{ message: { content: 'This is a one-sentence summary.' } }],
        });

        const summary = await service.generateSummary('Long content to summarize');
        expect(summary).toBe('This is a one-sentence summary.');
      });

      it('should use Gemini when gemini model is specified', async () => {
        mockGeminiContent.mockResolvedValue({
          response: { text: () => 'Gemini summary.' },
        });

        const summary = await service.generateSummary('content', 'gemini-2.0-flash');
        expect(summary).toBe('Gemini summary.');
        expect(mockGeminiContent).toHaveBeenCalled();
      });

      it('should throw HttpException if Groq returns empty text', async () => {
        getGroqMockCreate().mockResolvedValue({
          choices: [{ message: { content: '' } }],
        });

        await expect(service.generateSummary('some content')).rejects.toThrow();
      });

      it('should throw if Groq call fails', async () => {
        getGroqMockCreate().mockRejectedValue(new Error('Network failure'));

        await expect(service.generateSummary('some content')).rejects.toThrow();
      });

      it('should throw HttpException if Gemini returns empty text', async () => {
        mockGeminiContent.mockResolvedValue({
          response: { text: () => '' },
        });

        await expect(
          service.generateSummary('some content', 'gemini-2.0-flash'),
        ).rejects.toThrow();
      });
    });
  });

  // ── Without any API keys ──────────────────────────────────────────
  describe('without GEMINI_API_KEY or GROQ_API_KEY', () => {
    beforeEach(() => {
      delete process.env.GEMINI_API_KEY;
      delete process.env.GROQ_API_KEY;
      service = new AiService();
    });

    it('generateTags should use keyword fallback and not call Gemini or Groq', async () => {
      const tags = await service.generateTags('learning python algorithms about coding skills');
      expect(tags).toBeInstanceOf(Array);
      expect(mockGeminiContent).not.toHaveBeenCalled();
      expect(getGroqMockCreate()).not.toHaveBeenCalled();
    });

    it('generateTags fallback should exclude stop words', async () => {
      const tags = await service.generateTags('about there their would could should which these');
      expect(tags).toEqual([]);
    });

    it('generateTags fallback should deduplicate words', async () => {
      const tags = await service.generateTags('python python python learning learning');
      const unique = new Set(tags);
      expect(unique.size).toBe(tags.length);
    });

    it('generateSummary without Groq key should return unavailable message', async () => {
      const summary = await service.generateSummary('any content here');
      expect(typeof summary).toBe('string');
      expect(summary.toLowerCase()).toMatch(/unavailable|no.*key|configured/);
    });
  });

  // ── stripHtml ─────────────────────────────────────────────────────
  describe('stripHtml export', () => {
    it('strips HTML tags from content before AI processing', async () => {
      process.env.GROQ_API_KEY = 'test-key';
      service = new AiService();

      getGroqMockCreate().mockResolvedValue({
        choices: [{ message: { content: '["physics", "motion"]' } }],
      });

      // HTML content should be stripped before sending to AI
      await service.generateTags('<p><strong>Physics</strong> of <em>motion</em></p>');
      const callArg: string = getGroqMockCreate().mock.calls[0]?.[0]?.messages?.[1]?.content ?? '';
      expect(callArg).not.toContain('<p>');
      expect(callArg).not.toContain('<strong>');

      delete process.env.GROQ_API_KEY;
    });
  });
});
