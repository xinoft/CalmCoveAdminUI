import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts UTC datetime to local timezone
 * Usage: {{ utcDateTime | utcToLocal }}
 * Usage with format: {{ utcDateTime | utcToLocal: 'short' }}
 * Usage with format and timezone: {{ utcDateTime | utcToLocal: 'short': 'America/New_York' }}
 */
@Pipe({
    name: 'utcToLocal',
    standalone: true
})
export class UtcToLocalPipe implements PipeTransform {

    transform(value: any, format?: string, timezone?: string): any {
        if (!value) {
            return value;
        }

        // Convert string to Date if needed
        const date = typeof value === 'string' ? new Date(value) : value;

        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return value;
        }

        // If timezone is specified, convert to that timezone
        // Otherwise, use browser's local timezone
        const formattedDate = this.formatDate(date, format);
        return formattedDate;
    }

    /**
     * Formats date to local timezone
     * @param date - The UTC date
     * @param format - Angular date format (short, long, medium, etc.)
     */
    private formatDate(date: Date, format?: string): string {

        const utcTimeString = date + 'Z';

        // Use Angular's built-in date formatting through local conversion
        const localDate = new Date(utcTimeString);

        // For now, return ISO string. In production, integrate with DatePipe
        if (!format) {
            return localDate.toLocaleString();
        }

        // Return formatted date based on format parameter
        switch (format.toLowerCase()) {
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
     * Useful for converting datetime-local input values before API submission
     * @param localDateTimeString - ISO string from datetime-local input (e.g., "2024-01-18T14:30")
     * @returns UTC ISO string for API submission
     */
    localToUTC(localDateTimeString: string): string {
        if (!localDateTimeString) {
            throw new Error('Date string cannot be empty');
        }

        // Parse the datetime-local input value
        const localDate = new Date(localDateTimeString);
        
        if (isNaN(localDate.getTime())) {
            throw new Error('Invalid date string provided');
        }

        // Get the timezone offset in milliseconds
        const tzOffset = localDate.getTimezoneOffset() * 60 * 1000;
        
        // Convert to UTC by adding the offset
        const utcDate = new Date(localDate.getTime() + tzOffset);
        
        // Return as ISO string
        return utcDate.toISOString();
    }
}
