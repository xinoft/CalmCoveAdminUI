import { Injectable } from '@angular/core';

/**
 * Service for timezone conversion utilities
 * Handles converting UTC times to local timezone and vice versa
 */
@Injectable({
  providedIn: 'root'
})
export class TimezoneService {

  constructor() { }

  /**
   * Converts UTC datetime to local timezone
   * @param utcDate - The UTC date from API
   * @returns Date converted to local timezone
   */
  utcToLocal(utcDate: Date | string): Date {
    if (typeof utcDate === 'string') {
        const utcTimeString = utcDate + 'Z'
      utcDate = new Date(utcTimeString);
    }
    
    if (!(utcDate instanceof Date) || isNaN(utcDate.getTime())) {
      throw new Error('Invalid date provided');
    }

    // The date from API is already in UTC, JavaScript will handle the conversion
    // when displaying based on browser's local timezone
    return new Date(utcDate);
  }

  /**
   * Converts local datetime to UTC for sending to API
   * Uses timezone offset to accurately convert local time to UTC
   * @param localDate - The local date from UI
   * @returns ISO string in UTC format
   */
  localToUtc(localDate: Date | string): string {
    if (typeof localDate === 'string') {
      localDate = new Date(localDate);
    }
    
    if (!(localDate instanceof Date) || isNaN(localDate.getTime())) {
      throw new Error('Invalid date provided');
    }

    // Get the timezone offset in milliseconds
    // getTimezoneOffset() returns minutes offset FROM UTC (negative for ahead of UTC)
    // For India (UTC+5:30), returns -330
    const tzOffsetMs = localDate.getTimezoneOffset() * 60 * 1000;
    
    // Convert to UTC by subtracting the offset
    // UTC = Local - TZ_Offset
    // Since offset is negative for ahead (e.g., -330 for India), subtracting makes it +330
    const utcDate = new Date(localDate.getTime() - tzOffsetMs);
    
    // Return as ISO string (UTC)
    return utcDate.toISOString();
  }

  /**
   * Gets the local timezone offset in hours
   * @returns Timezone offset in hours
   */
  getTimezoneOffset(): number {
    return new Date().getTimezoneOffset() / 60;
  }

  /**
   * Gets the local timezone abbreviation
   * @returns Timezone abbreviation (e.g., EST, PST)
   */
  getTimezoneAbbr(): string {
    return new Date().toLocaleString('en-US', { timeZoneName: 'short' }).split(' ').pop() || 'GMT';
  }

  /**
   * Formats UTC date to readable local time string
   * @param utcDate - UTC date from API
   * @param format - Format type: 'short', 'long', 'medium', 'date', 'time'
   * @returns Formatted date string
   */
  formatUtcToLocal(utcDate: Date | string, format: 'short' | 'long' | 'medium' | 'date' | 'time' = 'short'): string {
    const localDate = this.utcToLocal(utcDate);

    switch (format) {
      case 'short':
        return localDate.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      case 'long':
        return localDate.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      case 'medium':
        return localDate.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      case 'date':
        return localDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      case 'time':
        return localDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      default:
        return localDate.toLocaleString();
    }
  }

  /**
   * Converts local datetime string to UTC ISO string
   * Useful for form submissions where you have datetime-local input value
   * @param localDateTimeString - ISO string from datetime-local input (e.g., "2024-01-18T14:30")
   * @returns UTC ISO string for API submission
   */
  convertLocalInputToUtc(localDateTimeString: string): any {
    const utcDate = new Date(localDateTimeString);
    return utcDate.toISOString();
  }
}

