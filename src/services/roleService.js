// src/services/authService.js
import api from './api';

const roleService = {
    addRole: async (userData) => {
        const response = await api.post('/roles', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            sessionStorage.setItem('token', response.data.token); // Store token
            sessionStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
        }
        return response.data;
    },

    logout: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return sessionStorage.getItem('token');
    }
};

export default roleService;