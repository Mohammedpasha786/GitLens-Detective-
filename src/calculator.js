/**
 * Calculator utility functions
 * This module provides basic mathematical operations and calculations
 * 
 * @author John Smith
 * @created 2023-05-15
 */

/**
 * Adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
    // Input validation added by Sarah Johnson on 2023-08-22
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Both arguments must be numbers');
    }
    return a + b;
}

/**
 * Subtracts second number from first number
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 */
function subtract(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Both arguments must be numbers');
    }
    return a - b;
}

/**
 * Multiplies two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
function multiply(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Both arguments must be numbers');
    }
    return a * b;
}

/**
 * Calculates tax amount based on price and tax rate
 * Originally created by Mike Davis on 2023-06-10
 * Modified by Lisa Chen on 2023-09-14 to add rounding
 * Updated by Alex Rodriguez on 2024-01-20 to handle edge cases
 * 
 * @param {number} amount - Base amount
 * @param {number} rate - Tax rate (as decimal, e.g., 0.08 for 8%)
 * @returns {number} Calculated tax amount
 */
function calculateTax(amount, rate) {
    if (typeof amount !== 'number' || typeof rate !== 'number') {
        throw new Error('Amount and rate must be numbers');
    }
    
    if (amount < 0) {
        throw new Error('Amount cannot be negative');
    }
    
    if (rate < 0 || rate > 1) {
        throw new Error('Tax rate must be between 0 and 1');
    }
    
    // Round to 2 decimal places to avoid floating point issues
    return Math.round(amount * rate * 100) / 100;
}

/**
 * Calculates discount amount based on original price and discount percentage
 * Created by Emma Wilson on 2023-07-25
 * Enhanced by David Brown on 2023-11-03 to support different discount types
 * 
 * @param {number} price - Original price
 * @param {number} percentage - Discount percentage (0-100)
 * @param {string} type - Discount type ('percentage' or 'fixed')
 * @returns {number} Discounted price
 */
function calculateDiscount(price, percentage, type = 'percentage') {
    if (typeof price !== 'number' || price < 0) {
        throw new Error('Price must be a positive number');
    }
    
    if (type === 'percentage') {
        if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
            throw new Error('Percentage must be between 0 and 100');
        }
        return price - (price * percentage / 100);
    } else if (type === 'fixed') {
        if (typeof percentage !== 'number' || percentage < 0) {
            throw new Error('Fixed discount amount must be positive');
        }
        return Math.max(0, price - percentage);
    } else {
        throw new Error('Invalid discount type. Use "percentage" or "fixed"');
    }
}

/**
 * Calculates compound interest
 * Added by Robert Taylor on 2023-12-05
 * 
 * @param {number} principal - Initial amount
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} time - Time in years
 * @param {number} compoundFreq - Compounding frequency per year
 * @returns {number} Final amount after compound interest
 */
function calculateCompoundInterest(principal, rate, time, compoundFreq = 1) {
    if (principal <= 0 || rate < 0 || time < 0 || compoundFreq <= 0) {
        throw new Error('Invalid parameters for compound interest calculation');
    }
    
    return principal * Math.pow(1 + rate / compoundFreq, compoundFreq * time);
}

// Export functions for use in other modules
module.exports = {
    add,
    subtract,
    multiply,
    calculateTax,
    calculateDiscount,
    calculateCompoundInterest
};
