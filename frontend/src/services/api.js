import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60s for ML processing
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

/**
 * Register a new user with their vein image.
 * @param {string} userId - Unique user identifier
 * @param {File} imageFile - Vein image file
 * @returns {Promise<object>} Registration result
 */
export const registerUser = async (userId, imageFile) => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('file', imageFile);

  const response = await api.post('/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Authenticate a user by their vein image.
 * @param {File} imageFile - Vein image file
 * @returns {Promise<object>} Authentication result
 */
export const authenticateUser = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await api.post('/authenticate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Fetch system analytics.
 * @returns {Promise<object>} Analytics data
 */
export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

/**
 * Health check for the API.
 * @returns {Promise<object>} Health status
 */
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
