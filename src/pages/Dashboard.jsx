import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Spinner from '../components/Spinner'; // Assuming you have a Spinner component
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = `${import.meta.env.VITE_APP_BACKEND_URL}/dashboard/data`;


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = sessionStorage.getItem('token-auth');
                if (!token) {
                    throw new Error('No authentication token found. Please log in.');
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.get(API_BASE_URL, config);
                setDashboardData(response.data);
                toast.success('Dashboard data loaded successfully!');
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again.');
                toast.error(err.response?.data?.message || err.message || 'Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
                <p className="ml-2 text-gray-700 dark:text-gray-300">Loading dashboard data...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="p-6 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg shadow-lg border border-red-300 dark:border-red-700">
                <h1 className="text-xl font-bold mb-2">Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    const { users = {},orders = {}, items = {} } = dashboardData || {};

    const userStatusData = [
        { name: 'Active', value: users.active || 0 },
        { name: 'Deactivated', value: users.deactivated || 0 },
    ];
    const userColors = ['#8884d8', '#82ca9d'];

    const itemStockData = [
        { name: 'Total Orders', value: orders.totalLastMonth || 0 },
        { name: 'Average Order', value: Number(orders.averageLastMonth).toFixed(0) || 0 },
        { name: 'Max Order', value: orders.maxOrders || 0 },
    ];


    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Dashboard Overview</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">Welcome to the admin dashboard. Here you can see an overview of your system.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="p-5 bg-blue-600 text-white rounded-md shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">User Statistics</h3>
                        <p className="text-3xl font-bold mb-1">Total Users: {users.total ?? 'N/A'}</p>
                    </div>
                    <div className="text-sm mt-2">
                        <p>Active: {users.active ?? 'N/A'}</p>
                        <p>Deactivated: {users.deactivated ?? 'N/A'}</p>
                    </div>
                </div>

                <div className="p-5 bg-green-600 text-white rounded-md shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Orders Overview</h3>
                        <p className="text-3xl font-bold mb-1">Total Orders: {orders.totalLastMonth ?? 'N/A'}</p>
                    </div>
                    <div className="text-sm mt-2">
                        <p>Average Order: {Number(orders.averageLastMonth).toFixed(0) ?? 'N/A'}</p>
                        <p>Max Order: {orders.maxOrders ?? 'N/A'}</p>
                    </div>
                </div>

                <div className="p-5 bg-yellow-600 text-white rounded-md shadow-lg">
                    <h3 className="text-xl font-semibold mb-2">Other Metrics</h3>
                    <p className="text-lg">Revenue: N/A</p>
                    <p className="text-lg">New Orders: N/A</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-gray-100">Visualizations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="p-5 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">User Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={userStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {userStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={userColors[index % userColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="p-5 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Item Stock Levels</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={itemStockData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                            <XAxis dataKey="name" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#82ca9d" name="Orders" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;