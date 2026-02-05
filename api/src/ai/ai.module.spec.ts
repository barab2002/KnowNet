import { Test, TestingModule } from '@nestjs/testing';
import { AiModule } from './ai.module';

describe('AiModule', () => {
  it('should compile', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AiModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
