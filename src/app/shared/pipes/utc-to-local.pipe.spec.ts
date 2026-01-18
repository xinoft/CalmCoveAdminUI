import { TestBed } from '@angular/core/testing';
import { UtcToLocalPipe } from './utc-to-local.pipe';

describe('UtcToLocalPipe', () => {
  let pipe: UtcToLocalPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    pipe = new UtcToLocalPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should convert UTC date to local string', () => {
      const utcDate = new Date('2024-01-18T18:25:00Z');
      const result = pipe.transform(utcDate);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle string input', () => {
      const utcDateString = '2024-01-18T18:25:00Z';
      const result = pipe.transform(utcDateString, 'short');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format with short format', () => {
      const utcDate = new Date('2024-01-18T18:25:00Z');
      const result = pipe.transform(utcDate, 'short');
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/); // MM/DD/YYYY format
    });

    it('should format with long format', () => {
      const utcDate = new Date('2024-01-18T18:25:00Z');
      const result = pipe.transform(utcDate, 'long');
      expect(result).toBeTruthy();
    });

    it('should handle null/undefined values', () => {
      expect(pipe.transform(null)).toBeNull();
      expect(pipe.transform(undefined)).toBeUndefined();
    });

    it('should return original value for invalid dates', () => {
      const invalidDate = 'not-a-date';
      const result = pipe.transform(invalidDate);
      expect(result).toBe(invalidDate);
    });
  });
});
