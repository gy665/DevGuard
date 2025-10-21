import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate for navigation

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null); // For success messages

    const navigate = useNavigate(); // <-- Get the navigate function from the router

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // --- Client-side validation ---
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Make the API call to your backend's register endpoint
            await axios.post('http://localhost:5001/api/auth/register', {
                email,
                password,
            });

            // If the API call is successful, show a success message
            setSuccess('Registration successful! Redirecting to login...');

            // Wait a moment so the user can see the success message, then redirect
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            // Display specific error from backend if available, otherwise a generic one
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
            console.error('Registration error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-slate-400 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-slate-400 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-400 mb-2" htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-center mb-4">{success}</p>}

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                        Sign Up
                    </button>
                </form>
                <p className="text-center text-slate-400 mt-6">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} className="text-blue-400 hover:underline">
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;