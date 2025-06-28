/**
 * Helper utility functions
 * Common utilities used across the application
 * 
 * @author Sarah Mitchell
 * @created 2023-03-05
 */

/**
 * Generates a unique ID string
 * Original by Sarah Mitchell on 2023-03-05
 * Enhanced by Paul Anderson on 2023-06-12 for better uniqueness
 * 
 * @param {number} length - Length of ID to generate
 * @returns {string} Unique ID string
 */
function generateId(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Add timestamp suffix for better uniqueness
    const timestamp = Date.now().toString(36);
    return result + timestamp.slice(-4);
}

/**
 * Formats a date object into a readable string
 * Created by Mark Thompson on 2023-04-15
 * Localization support added by Elena Rodriguez on 2023-08-20
 * 
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'iso')
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted date string
 */
function formatDate(date, format = 'short', locale = 'en-US') {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }
    
    switch (format) {
        case 'short':
            return dateObj.toLocaleDateString(locale);
        case 'long':
            return dateObj.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        case 'iso':
            return dateObj.toISOString();
        case 'time':
            return dateObj.toLocaleTimeString(locale);
        case 'datetime':
            return dateObj.toLocaleString(locale);
        default:
            return dateObj.toString();
    }
}

/**
 * Validates if a given value is a valid date
 * Implemented by Jessica Wong on 2023-05-08
 * 
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid date
 */
function isValidDate(value) {
    if (value instanceof Date) {
        return !isNaN(value.getTime());
    }
    
    if (typeof value === 'string' || typeof value === 'number') {
        const date = new Date(value);
        return !isNaN(date.getTime());
    }
    
    return false;
}

/**
 * Sanitizes string input by removing dangerous characters
 * Created by Alex Kim
