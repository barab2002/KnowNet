// Global test setup
import { jest } from '@jest/globals';

// Mock console to avoid noise, optional
// global.console = { ...console, log: jest.fn(), debug: jest.fn() };

beforeEach(() => {
  jest.clearAllMocks();
});
