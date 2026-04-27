import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import AdminLayout from './components/AdminLayout'; // Corrected path
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Roles from './pages/Roles';
import ProductInventory from './pages/ProductInventory';
import Uploaders from './pages/Uploaders';
import Employee from './pages/Employee';
import Merchandise from './pages/Merchandise';

// Create authentication check component
const RequireAuth = ({ children, isAuthenticated, isLoading }) => {
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300">Loading authentication status...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const token = sessionStorage.getItem('token-auth');
    console.log(token, "token", !!token)
    setIsAuthenticated(!!token);
    setIsLoadingAuth(false);
  }, []);

  // If still loading authentication status, show a loader
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          {/* Root path redirects to login or dashboard based on auth status */}
          <Route path="/" element={
            isAuthenticated ?
              <Navigate to="/dashboard" replace /> :
              <Navigate to="/login" replace />
          } />

          {/* Public routes */}
          <Route path="/login" element={
            isAuthenticated ?
              <Navigate to="/dashboard" replace /> :
              <LoginPage setIsAuthenticated={setIsAuthenticated} />
          } />

          <Route path="/register" element={
            isAuthenticated ?
              <Navigate to="/dashboard" replace /> :
              <RegisterPage setIsAuthenticated={setIsAuthenticated} /> // Pass setIsAuthenticated
          } />

          {/* Protected routes */}
          <Route element={
            <RequireAuth isAuthenticated={isAuthenticated} isLoading={isLoadingAuth}>
              <AdminLayout /> {/* AdminLayout no longer needs setIsAuthenticated directly */}
            </RequireAuth>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/merchandise" element={<Merchandise />} />
            <Route path="/falcon_ids" element={<ProductInventory />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/bulk-uploaders" element={<Uploaders />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
              <a
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
              >
                {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
              </a>
            </div>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;