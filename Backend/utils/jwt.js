import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // 7 days
const JWT_REFRESH_EXPIRES_IN = "30d"; // 30 days

/**
 * Generate access token
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT token
 */
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

/**
 * Generate refresh token
 * @param {Object} payload - User data to encode in token
 * @returns {String} Refresh JWT token
 */
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN
    });
};

/**
 * Verify JWT token
 * @param {String} token - Token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object with accessToken and refreshToken
 */
export const generateTokens = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        name: user.name
    };

    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload)
    };
};
