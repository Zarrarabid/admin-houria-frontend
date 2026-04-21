// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import roleService from '../services/roleService'; // Keep if you intend to use it, otherwise can remove
import { handleApiError } from '../utils/errorHandler';
import { toast, ToastContainer } from 'react-toastify';
import Spinner from '../components/Spinner';

const RegisterPage = ({ setIsAuthenticated }) => { // Accept setIsAuthenticated prop
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.register({ username, email, password, roleName: 'admin' });
            toast.success(response.message || 'Registration successful!');

            // Optionally, log the user in directly after registration
            // This is a common UX pattern to avoid making the user log in immediately after registering
            sessionStorage.setItem('token-auth', response.token); // Assuming registration returns a token
            setIsAuthenticated(true); // Update authentication state
            navigate('/dashboard'); // Redirect to dashboard after successful registration and login

        } catch (error) {
            handleApiError(error, 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <ToastContainer />
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition-colors duration-200"
                            placeholder="Your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition-colors duration-200"
                            placeholder="your@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-200 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition-colors duration-200"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-200 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition-colors duration-200"
                            placeholder="********"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 w-full"
                            disabled={loading}
                        >
                            {loading ? <Spinner /> : 'Register'}
                        </button>
                    </div>
                    <p className="text-center text-gray-700 dark:text-gray-300 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-500 font-bold transition-colors duration-200">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;