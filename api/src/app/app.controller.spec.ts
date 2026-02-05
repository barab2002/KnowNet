import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getConnectionToken } from '@nestjs/mongoose';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockConnection = {
    readyState: 1, // Connected
  };

  const mockAppService = {
    getData: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: getConnectionToken(), useValue: mockConnection },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const result = { message: 'Hello API' };
      mockAppService.getData.mockReturnValue(result);

      expect(appController.getData()).toBe(result);
    });

    it('should handle service returning null/empty', () => {
      mockAppService.getData.mockReturnValue(null);
      expect(appController.getData()).toBeNull();
    });
  });

  describe('healthCheck', () => {
    it('should return healthy status when connected', () => {
      mockConnection.readyState = 1;
      const result = appController.healthCheck();
      expect(result.status).toBe('ok');
      expect(result.database.status).toBe('connected');
    });

    it('should return disconnected status when readyState is 0', () => {
      mockConnection.readyState = 0;
      const result = appController.healthCheck();
      expect(result.database.status).toBe('disconnected');
    });
  });
});
