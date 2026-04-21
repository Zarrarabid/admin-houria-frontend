// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000/api'; // From .env.local

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token'); // Get token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for general error handling (optional, but can be useful)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can handle specific global error cases here, e.g., 401 Unauthorized
        // if (error.response && error.response.status === 401) {
        //     console.error('Unauthorized request. Redirecting to login...');
        //     localStorage.removeItem('token');
        //     window.location.href = '/login'; // Redirect to login
        // }
        return Promise.reject(error);
    }
);

export default api;