import { body, param, query, validationResult } from "express-validator";

/**
 * Middleware to check validation results
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: errors.array()[0].msg,
            errors: errors.array() 
        });
    }
    next();
};

/**
 * Validation rules for user registration
 */
export const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    validate
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required'),
    
    validate
];

/**
 * Validation rules for chat message
 */
export const chatValidation = [
    body('threadId')
        .notEmpty().withMessage('Thread ID is required')
        .isString().withMessage('Thread ID must be a string'),
    
    body('message')
        .optional()
        .isString().withMessage('Message must be a string')
        .isLength({ max: 5000 }).withMessage('Message is too long (max 5000 characters)'),
    
    body('userId')
        .notEmpty().withMessage('User ID is required')
        .isString().withMessage('User ID must be a string'),
    
    body('userEmail')
        .notEmpty().withMessage('User email is required')
        .isEmail().withMessage('Invalid user email'),
    
    body('image')
        .optional()
        .isString().withMessage('Image must be a base64 string'),
    
    validate
];

/**
 * Validation rules for thread ID parameter
 */
export const threadIdValidation = [
    param('threadId')
        .notEmpty().withMessage('Thread ID is required')
        .isString().withMessage('Thread ID must be a string'),
    
    query('userId')
        .notEmpty().withMessage('User ID is required')
        .isString().withMessage('User ID must be a string'),
    
    validate
];

/**
 * Validation rules for getting threads
 */
export const getThreadsValidation = [
    query('userId')
        .notEmpty().withMessage('User ID is required')
        .isString().withMessage('User ID must be a string'),
    
    validate
];
