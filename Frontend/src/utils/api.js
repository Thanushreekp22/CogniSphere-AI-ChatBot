/**
 * Utility function to make API calls with JWT authentication
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get the authorization header with JWT token
 */
const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            // Handle token expiration
            if (response.status === 401 && data.error?.includes('expired')) {
                // Token expired - try to refresh or logout
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                window.location.reload(); // Force re-login
            }
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
    return apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

/**
 * Register user
 */
export const registerUser = async (name, email, password) => {
    return apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });
};

/**
 * Send chat message
 */
export const sendChatMessage = async (threadId, message, userId, userEmail, image = null) => {
    return apiRequest('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ threadId, message, userId, userEmail, image }),
    });
};

/**
 * Get all threads
 */
export const getThreads = async (userId) => {
    return apiRequest(`/api/chat/threads?userId=${encodeURIComponent(userId)}`);
};

/**
 * Get specific thread
 */
export const getThread = async (threadId, userId) => {
    return apiRequest(`/api/chat/threads/${threadId}?userId=${encodeURIComponent(userId)}`);
};

/**
 * Delete thread
 */
export const deleteThread = async (threadId, userId) => {
    return apiRequest(`/api/chat/threads/${threadId}?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
    });
};

export default {
    apiRequest,
    loginUser,
    registerUser,
    sendChatMessage,
    getThreads,
    getThread,
    deleteThread,
};
