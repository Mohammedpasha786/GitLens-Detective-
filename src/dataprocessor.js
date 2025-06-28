/**
 * Data Processing Utilities
 * Handles data transformation, filtering, and analysis
 * 
 * @author Michael Chen
 * @created 2023-03-12
 */

const { isValidDate, sanitizeString } = require('./utils/helpers');

/**
 * Processes raw data through validation and transformation pipeline
 * Original implementation by Michael Chen on 2023-03-12
 * Performance optimizations by Laura Wilson on 2023-06-18
 * Added error handling by James Rodriguez on 2023-09-05
 * Memory optimization by Sophie Anderson on 2024-01-10
 * 
 * @param {Array} rawData - Array of raw data objects
 * @param {Object} options - Processing options
 * @returns {Array} Processed data array
 */
function processData(rawData, options = {}) {
    if (!Array.isArray(rawData)) {
        throw new Error('Input data must be an array');
    }
    
    if (rawData.length === 0) {
        return [];
    }
    
    const {
        validateFields = true,
        sanitizeStrings = true,
        removeNulls = true,
        sortBy = null,
        limit = null
    } = options;
    
    let processedData = [...rawData]; // Create shallow copy
    
    try {
        // Step 1: Validate and clean data
        if (validateFields) {
            processedData = processedData.filter(item => {
                return item && typeof item === 'object' && Object.keys(item).length > 0;
            });
        }
        
        // Step 2: Remove null/undefined values if requested
        if (removeNulls) {
            processedData = processedData.map(item => {
                const cleaned = {};
                for (const [key, value] of Object.entries(item)) {
                    if (value !== null && value !== undefined) {
                        cleaned[key] = value;
                    }
                }
                return cleaned;
            });
        }
        
        // Step 3: Sanitize string fields
        if (sanitizeStrings) {
            processedData = processedData.map(item => {
                const sanitized = {};
                for (const [key, value] of Object.entries(item)) {
                    if (typeof value === 'string') {
                        sanitized[key] = sanitizeString(value);
                    } else {
                        sanitized[key] = value;
                    }
                }
                return sanitized;
            });
        }
        
        // Step 4: Sort data if requested
        if (sortBy) {
            processedData = sortData(processedData, sortBy);
        }
        
        // Step 5: Apply limit if specified
        if (limit && typeof limit === 'number' && limit > 0) {
            processedData = processedData.slice(0, limit);
        }
        
        return processedData;
        
    } catch (error) {
        console.error('Error processing data:', error.message);
        throw new Error(`Data processing failed: ${error.message}`);
    }
}

/**
 * Filters data based on specified criteria
 * Created by Anna Thompson on 2023-04-08
 * Enhanced by Diego Martinez on 2023-07-22 to support complex queries
 * Added performance improvements by Lisa Chang on 2023-10-12
 * 
 * @param {Array} data - Data array to filter
 * @param {Object} criteria - Filter criteria
 * @returns {Array} Filtered data array
 */
function filterData(data, criteria) {
    if (!Array.isArray(data)) {
        throw new Error('Data must be an array');
    }
    
    if (!criteria || typeof criteria !== 'object') {
        return data;
    }
    
    return data.filter(item => {
        return Object.entries(criteria).every(([key, value]) => {
            if (!(key in item)) {
                return false;
            }
            
            // Handle different filter types
            if (typeof value === 'object' && value !== null) {
                // Range filter: { min: 10, max: 100 }
                if ('min' in value && 'max' in value) {
                    const itemValue = Number(item[key]);
                    return itemValue >= value.min && itemValue <= value.max;
                }
                
                // Array filter: { in: ['value1', 'value2'] }
                if ('in' in value && Array.isArray(value.in)) {
                    return value.in.includes(item[key]);
                }
                
                // Pattern filter: { pattern: 'regex' }
                if ('pattern' in value) {
                    const regex = new RegExp(value.pattern, 'i');
                    return regex.test(String(item[key]));
                }
            }
            
            // Exact match
            return item[key] === value;
        });
    });
}

/**
 * Sorts data by specified field and order
 * Implemented by Ryan Foster on 2023-05-20
 * Multi-field sorting added by Grace Lee on 2023-08-15
 * 
 * @param {Array} data - Data array to sort
 * @param {string|Object} sortBy - Sort field or configuration
 * @returns {Array} Sorted data array
 */
function sortData(data, sortBy) {
    if (!Array.isArray(data)) {
        throw new Error('Data must be an array');
    }
    
    if (!sortBy) {
        return data;
    }
    
    // Create a copy to avoid mutating original array
    const sortedData = [...data];
    
    if (typeof sortBy === 'string') {
        // Simple field sort
        return sortedData.sort((a, b) => {
            const valueA = a[sortBy];
            const valueB = b[sortBy];
            
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
            return 0;
        });
    }
    
    if (typeof sortBy === 'object') {
        const { field, order = 'asc', type = 'auto' } = sortBy;
        
        return sortedData.sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];
            
            // Handle different data types
            if (type === 'number') {
                valueA = Number(valueA) || 0;
                valueB = Number(valueB) || 0;
            } else if (type === 'date') {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            } else if (type === 'string') {
                valueA = String(valueA).toLowerCase();
                valueB = String(valueB).toLowerCase();
            }
            
            let comparison = 0;
            if (valueA < valueB) comparison = -1;
            if (valueA > valueB) comparison = 1;
            
            return order === 'desc' ? -comparison : comparison;
        });
    }
    
    return sortedData;
}

/**
 * Groups data by specified field
 * Added by Oliver Johnson on 2023-09-30
 * 
 * @param {Array} data - Data array to group
 * @param {string} groupBy - Field to group by
 * @returns {Object} Grouped data object
 */
function groupData(data, groupBy) {
    if (!Array.isArray(data)) {
        throw new Error('Data must be an array');
    }
    
    if (!groupBy || typeof groupBy !== 'string') {
        throw new Error('GroupBy field must be a string');
    }
    
    return data.reduce((groups, item) => {
        const key = item[groupBy];
        if (key === undefined || key === null) {
            return groups;
        }
        
        const groupKey = String(key);
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        
        groups[groupKey].push(item);
        return groups;
    }, {});
}

/**
 * Calculates aggregate statistics for numerical data
 * Created by Natalie Brown on 2023-11-08
 * 
 * @param {Array} data - Data array
 * @param {string} field - Field to calculate stats for
 * @returns {Object} Statistics object
 */
function calculateStats(data, field) {
    if (!Array.isArray(data) || data.length === 0) {
        return { count: 0, sum: 0, average: 0, min: 0, max: 0 };
    }
    
    const values = data
        .map(item => Number(item[field]))
        .filter(value => !isNaN(value));
    
    if (values.length === 0) {
        return { count: 0, sum: 0, average: 0, min: 0, max: 0 };
    }
    
    const sum = values.reduce((total, value) => total + value, 0);
    const average = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return {
        count: values.length,
        sum: Math.round(sum * 100) / 100,
        average: Math.round(average * 100) / 100,
        min,
        max
    };
}

module.exports = {
    processData,
    filterData,
    sortData,
    groupData,
    calculateStats
};
