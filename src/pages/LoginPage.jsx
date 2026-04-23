// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { handleApiError } from '../utils/errorHandler';
import { toast, ToastContainer } from 'react-toastify';
import Spinner from '../components/Spinner';

const LoginPage = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get redirect path from location state or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login({ email, password });
            toast.success(response.message || 'Login successful!');

            sessionStorage.setItem('token-auth', response.token);
            sessionStorage.setItem('userDetails', JSON.stringify(response.user));
            setIsAuthenticated(true); // Update state in App.jsx
            navigate(from, { replace: true });

        } catch (error) {
            handleApiError(error, 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // REMOVE THIS useEffect. App.jsx is now responsible for initial authentication check and redirection.
    // This was causing a conflicting redirect.
    // useEffect(() => {
    //     const token = localStorage.getItem('token-auth'); // Corrected key to 'token-auth'
    //     if (token) {
    //         navigate(from, { replace: true });
    //     }
    // }, [navigate, from]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <ToastContainer />
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Login</h2>
                <form onSubmit={handleSubmit}>
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
                            autoFocus
                        />
                    </div>
                    <div className="mb-6">
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
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 w-full"
                            disabled={loading}
                        >
                            {loading ? <Spinner /> : 'Login'}
                        </button>
                    </div>
                    {/* <p className="text-center text-gray-700 dark:text-gray-300 text-sm">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            state={{ from: location.state?.from }}
                            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-500 font-bold transition-colors duration-200"
                        >
                            Register
                        </Link>
                    </p> */}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;