import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
    const { token, loading } = useAuth();

    // 1. While the AuthContext is checking for a token, show a loading screen.
    // This prevents the "flash" of the login page or a premature error.
    if (loading) {
        return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Authenticating...</div>;
    }

    // 2. After checking, if a token exists, render the child component.
    // The <Outlet /> is a placeholder for whatever page we are protecting (e.g., HomePage).
    // If there is no token, redirect the user to the /login page.
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;