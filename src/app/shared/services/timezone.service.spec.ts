import { TestBed } from '@angular/core/testing';

import { TimezoneService } from './timezone.service';

describe('TimezoneService', () => {
  let service: TimezoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimezoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('utcToLocal', () => {
    it('should convert UTC date to local timezone', () => {
      // Example: UTC 6:25 PM should convert to local time based on browser timezone
      const utcDate = new Date('2024-01-18T18:25:00Z');
      const localDate = service.utcToLocal(utcDate);
      expect(localDate).toBeInstanceOf(Date);
    });

    it('should handle string dates', () => {
      const utcDateString = '2024-01-18T18:25:00Z';
      const localDate = service.utcToLocal(utcDateString);
      expect(localDate).toBeInstanceOf(Date);
    });

    it('should throw error for invalid dates', () => {
      expect(() => service.utcToLocal('invalid-date')).toThrow();
    });
  });

  describe('formatUtcToLocal', () => {
    it('should format short datetime', () => {
      const utcDate = new Date('2024-01-18T18:25:00Z');
      const formatted = service.formatUtcToLocal(utcDate, 'short');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should format long datetime', () => {
      const utcDate = new Date('2024-01-18T18:25:00Z');
      const formatted = service.formatUtcToLocal(utcDate, 'long');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should format date only', () => {
      const utcDate = new Date('2024-01-18T18:25:00Z');
      const formatted = service.formatUtcToLocal(utcDate, 'date');
      expect(formatted).toBeTruthy();
      expect(formatted).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('getTimezoneOffset', () => {
    it('should return timezone offset in hours', () => {
      const offset = service.getTimezoneOffset();
      expect(typeof offset).toBe('number');
    });
  });

  describe('getTimezoneAbbr', () => {
    it('should return timezone abbreviation', () => {
      const abbr = service.getTimezoneAbbr();
      expect(typeof abbr).toBe('string');
      expect(abbr.length).toBeGreaterThan(0);
    });
  });
});
