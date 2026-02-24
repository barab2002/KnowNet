import { AiService } from './ai.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

jest.mock('@google/generative-ai');

describe('AiService', () => {
  let service: AiService;
  let mockGenerateContent: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateContent = jest.fn();

    (GoogleGenerativeAI as jest.MockedClass<typeof GoogleGenerativeAI>).mockImplementation(
      () =>
        ({
          getGenerativeModel: jest.fn().mockReturnValue({
            generateContent: mockGenerateContent,
          }),
        }) as any,
    );
  });

  describe('with GEMINI_API_KEY set', () => {
    beforeEach(() => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      service = new AiService();
    });

    afterEach(() => {
      delete process.env.GEMINI_API_KEY;
    });

    describe('generateTags', () => {
      it('should return parsed tags from Gemini', async () => {
        mockGenerateContent.mockResolvedValue({
          response: { text: () => '["machine learning", "python", "data science"]' },
        });

        const tags = await service.generateTags('A post about machine learning with Python');
        expect(tags).toEqual(['machine learning', 'python', 'data science']);
      });

      it('should strip markdown code fences from response', async () => {
        mockGenerateContent.mockResolvedValue({
          response: { text: () => '```json\n["tag1", "tag2", "tag3"]\n```' },
        });

        const tags = await service.generateTags('some content');
        expect(tags).toEqual(['tag1', 'tag2', 'tag3']);
      });

      it('should lowercase all tags', async () => {
        mockGenerateContent.mockResolvedValue({
          response: { text: () => '["Machine Learning", "PYTHON", "AI Tools"]' },
        });

        const tags = await service.generateTags('content');
        expect(tags).toEqual(['machine learning', 'python', 'ai tools']);
      });

      it('should cap tags at 20', async () => {
        const manyTags = Array.from({ length: 25 }, (_, i) => `tag${i}`);
        mockGenerateContent.mockResolvedValue({
          response: { text: () => JSON.stringify(manyTags) },
        });

        const tags = await service.generateTags('content');
        expect(tags).toHaveLength(20);
      });

      it('should fall back to keyword extraction if Gemini throws', async () => {
        mockGenerateContent.mockRejectedValue(new Error('API Error'));

        const tags = await service.generateTags('learning python algorithms coding skills');
        expect(tags).toBeInstanceOf(Array);
        expect(tags.length).toBeGreaterThan(0);
      });

      it('should fall back to keyword extraction if response is not valid JSON', async () => {
        mockGenerateContent.mockResolvedValue({
          response: { text: () => 'not valid json at all' },
        });

        const tags = await service.generateTags('learning about python algorithms');
        expect(tags).toBeInstanceOf(Array);
      });

      it('should fall back to keyword extraction if response is not an array', async () => {
        mockGenerateContent.mockResolvedValue({
          response: { text: () => '{"tag": "value"}' },
        });

        const tags = await service.generateTags('some learning content here');
        expect(tags).toBeInstanceOf(Array);
      });
    });

    describe('generateSummary', () => {
      it('should return summary text from Gemini', async () => {
        mockGenerateContent.mockResolvedValue({
          response: { text: () => 'This is a one-sentence summary.' },
        });

        const summary = await service.generateSummary('Long content to summarize');
        expect(summary).toBe('This is a one-sentence summary.');
      });

      it('should throw AI Error if Gemini returns empty text', async () => {
        mockGenerateContent.mockResolvedValue({
          response: { text: () => '' },
        });

        await expect(service.generateSummary('some content')).rejects.toThrow('AI Error');
      });

      it('should throw AI Error if Gemini call fails', async () => {
        mockGenerateContent.mockRejectedValue(new Error('Network failure'));

        await expect(service.generateSummary('some content')).rejects.toThrow('AI Error: Network failure');
      });

      it('should pass accessToken context without changing behaviour', async () => {
        mockGenerateContent.mockResolvedValue({
          response: { text: () => 'Summary with token.' },
        });

        const summary = await service.generateSummary('content', 'my-access-token');
        expect(summary).toBe('Summary with token.');
        expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('without GEMINI_API_KEY', () => {
    beforeEach(() => {
      delete process.env.GEMINI_API_KEY;
      service = new AiService();
    });

    it('generateTags should use keyword fallback and not call Gemini', async () => {
      const tags = await service.generateTags('learning python algorithms about coding skills');
      expect(tags).toBeInstanceOf(Array);
      expect(mockGenerateContent).not.toHaveBeenCalled();
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

    it('generateSummary should return mock placeholder text', async () => {
      const summary = await service.generateSummary('any content here');
      expect(summary).toContain('Mock summary');
      expect(mockGenerateContent).not.toHaveBeenCalled();
    });
  });
});
