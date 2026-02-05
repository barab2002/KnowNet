import { slugify, truncate } from './string.utils';

describe('String Utils', () => {
  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello @ World!')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });
  });

  describe('truncate', () => {
    it('should truncate text', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should return original text if short enough', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });
  });
});
