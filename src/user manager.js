/**
 * User Management System
 * Handles user creation, validation, and profile management
 * 
 * @author Jennifer Martinez
 * @created 2023-04-20
 */

const { validateEmail, validatePassword } = require('./utils/validators');
const { generateId, formatDate } = require('./utils/helpers');

// In-memory user storage (in production, this would be a database)
let users = new Map();

/**
 * Creates a new user account
 * Original implementation by Jennifer Martinez on 2023-04-20
 * Enhanced by Kevin Anderson on 2023-07-12 to add email verification
 * Security improvements by Rachel Green on 2023-10-08
 * 
 * @param {Object} userData - User data object
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @returns {Object} Created user object (without password)
 */
function createUser(userData) {
    const { email, password, firstName, lastName } = userData;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
        throw new Error('All fields are required: email, password, firstName, lastName');
    }
    
    // Check if user already exists
    if (getUserByEmail(email)) {
        throw new Error('User with this email already exists');
    }
    
    // Validate email format
    if (!validateEmail(email)) {
        throw new Error('Invalid email format');
    }
    
    // Validate password strength
    if (!validatePassword(password)) {
        throw new Error('Password does not meet security requirements');
    }
    
    // Create user object
    const userId = generateId();
    const user = {
        id: userId,
        email: email.toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
        profile: {
            avatar: null,
            bio: '',
            preferences: {
                notifications: true,
                theme: 'light'
            }
        }
    };
    
    // Store user (password would be hashed in production)
    users.set(userId, { ...user, passwordHash: hashPassword(password) });
    
    // Return user without password
    return user;
}

/**
 * Validates user credentials and data integrity
 * Created by Tom Wilson on 2023-05-18
 * Updated by Maria Lopez on 2023-08-30 to add additional checks
 * 
 * @param {Object} user - User object to validate
 * @returns {boolean} True if user is valid
 */
function validateUser(user) {
    if (!user || typeof user !== 'object') {
        return false;
    }
    
    // Check required fields
    const requiredFields = ['id', 'email', 'firstName', 'lastName', 'createdAt'];
    for (const field of requiredFields) {
        if (!user[field]) {
            return false;
        }
    }
    
    // Validate email format
    if (!validateEmail(user.email)) {
        return false;
    }
    
    // Validate creation date
    const createdAt = new Date(user.createdAt);
    if (isNaN(createdAt.getTime())) {
        return false;
    }
    
    // Check if user exists in storage
    return users.has(user.id);
}

/**
 * Updates user profile information
 * Implemented by Carlos Santos on 2023-06-25
 * Refactored by Amy Johnson on 2023-09-20 for better error handling
 * Added audit logging by Steve Miller on 2024-02-15
 * 
 * @param {string} userId - User ID
 * @param {Object} updates - Object containing fields to update
 * @returns {Object} Updated user object
 */
function updateUserProfile(userId, updates) {
    if (!userId || typeof userId !== 'string') {
        throw new Error('Valid user ID is required');
    }
    
    const user = users.get(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    // Validate updates object
    if (!updates || typeof updates !== 'object') {
        throw new Error('Updates object is required');
    }
    
    // Fields that can be updated
    const allowedFields = ['firstName', 'lastName', 'profile'];
    const updatedFields = {};
    
    // Process each update
    for (const [key, value] of Object.entries(updates)) {
        if (!allowedFields.includes(key)) {
            throw new Error(`Field '${key}' cannot be updated`);
        }
        
        if (key === 'profile' && typeof value === 'object') {
            // Merge profile updates
            updatedFields.profile = { ...user.profile, ...value };
        } else if (key === 'firstName' || key === 'lastName') {
            // Validate and trim name fields
            if (typeof value !== 'string' || value.trim().length === 0) {
                throw new Error(`${key} must be a non-empty string`);
            }
            updatedFields[key] = value.trim();
        }
    }
    
    // Update user
    const updatedUser = { ...user, ...updatedFields, updatedAt: new Date().toISOString() };
    users.set(userId, updatedUser);
    
    // Log the update (in production, this would go to an audit log)
    console.log(`User ${userId} profile updated at ${updatedUser.updatedAt}`);
    
    // Return user without sensitive data
    const { passwordHash, ...safeUser } = updatedUser;
    return safeUser;
}

/**
 * Retrieves user by email address
 * Created by Nancy Davis on 2023-05-10
 * 
 * @param {string} email - Email address
 * @returns {Object|null} User object or null if not found
 */
function getUserByEmail(email) {
    if (!email || typeof email !== 'string') {
        return null;
    }
    
    const normalizedEmail = email.toLowerCase();
    for (const user of users.values()) {
        if (user.email === normalizedEmail) {
            const { passwordHash, ...safeUser } = user;
            return safeUser;
        }
    }
    
    return null;
}

/**
 * Updates user's last login timestamp
 * Added by Peter Clark on 2023-11-15
 * 
 * @param {string} userId - User ID
 * @returns {boolean} True if successful
 */
function updateLastLogin(userId) {
    const user = users.get(userId);
    if (!user) {
        return false;
    }
    
    user.lastLogin = new Date().toISOString();
    users.set(userId, user);
    return true;
}

/**
 * Simple password hashing (in production, use bcrypt or similar)
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
function hashPassword(password) {
    // This is a simple hash for demo purposes only
    // In production, use bcrypt, scrypt, or similar
    return Buffer.from(password).toString('base64');
}

module.exports = {
    createUser,
    validateUser,
    updateUserProfile,
    getUserByEmail,
    updateLastLogin
};
