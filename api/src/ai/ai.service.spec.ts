import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

jest.mock('@google/generative-ai');

describe('AiService', () => {
  let service: AiService;
  let mockGenAI: any;
  let mockModel: any;

  beforeEach(async () => {
    mockModel = {
      generateContent: jest.fn(),
    };
    mockGenAI = {
      getGenerativeModel: jest.fn().mockReturnValue(mockModel),
    };
    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => mockGenAI);

    process.env.GEMINI_API_KEY = 'test-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSummary', () => {
    it('should return summary text', async () => {
      const mockResponse = {
        response: {
          text: jest.fn().mockReturnValue('Summary text'),
        },
      };
      mockModel.generateContent.mockResolvedValue(mockResponse);

      const result = await service.generateSummary('Content');
      expect(result).toBe('Summary text');
    });

    it('should fallback if no API key', async () => {
      delete process.env.GEMINI_API_KEY;
      // Re-init service to trigger fallback logic
      const module: TestingModule = await Test.createTestingModule({
        providers: [AiService],
      }).compile();
      const fallbackService = module.get<AiService>(AiService);

      // We assume the service constructor checks env.
      // Note: In our implementation, we check env in constructor.
      // However, we are mocking GoogleGenerativeAI so the constructor call inside service won't fail.
      // But if apiKey is missing, our code logs warning and doesn't init genAI.
      // We need to simulate that `this.genAI` is undefined.
      // Since `genAI` is private, we can't easily set it to undefined from outside without casting.

      // Actually best way is to instantiate a new service where env is undefined.
      // But process.env is global.

      expect(await fallbackService.generateSummary('Content')).toContain(
        'Mock summary',
      );
    });
  });
});
