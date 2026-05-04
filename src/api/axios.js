import axios from 'axios';

// Base URL of our Django backend
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// REQUEST INTERCEPTOR
// Runs before every request is sent
// Automatically adds JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
// Runs after every response is received
// If token expired (401), try to refresh it automatically
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                const refresh = localStorage.getItem('refresh_token');
                const response = await axios.post(
                    `${BASE_URL}/api/accounts/token/refresh/`,
                    { refresh }
                );
                const newAccess = response.data.access;
                localStorage.setItem('access_token', newAccess);
                original.headers.Authorization = `Bearer ${newAccess}`;
                return api(original);
            } catch (err) {
                // Refresh failed — clear tokens and redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;