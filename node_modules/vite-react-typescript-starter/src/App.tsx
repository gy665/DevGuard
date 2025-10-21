import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import your page/component files
import HomePage from './components/HomePage';
import LoginPage from './components/Login'; // Assuming you have a Login.tsx
import RegisterPage from './components/Register'; // Assuming you have a Register.tsx
import ProtectedRoute from './components/ProtectedRoute'; // <-- IMPORT THE GATEKEEPER

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* --- PUBLIC ROUTES --- */}
                    {/* These routes are accessible to everyone */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* --- PROTECTED ROUTES --- */}
                    {/* This special route uses our ProtectedRoute as a wrapper. */}
                    {/* Any route nested inside will be protected. */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<HomePage />} />
                        {/* You can add more protected routes here later, e.g., /profile */}
                    </Route>

                    {/* --- FALLBACK ROUTE --- */}
                    {/* Redirects the root path "/" to the dashboard. */}
                    {/* The ProtectedRoute will handle redirecting to /login if not authenticated. */}
                    <Route path="/" element={<Navigate to="/dashboard" />} />

                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;