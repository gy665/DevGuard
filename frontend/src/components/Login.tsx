import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate for redirection
import { useAuth } from '../contexts/AuthContext'; // <-- Import useAuth to get the login function

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate(); // <-- Get the navigate function from the router
    const { login } = useAuth(); // <-- Get the login function from our context

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            // Make the API call to your backend's login endpoint
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password,
            });

            const { token } = response.data;

            // If the API call is successful, call the login function from our context
            if (token) {
                login(token);
                // And then navigate the user to the dashboard
                navigate('/dashboard');
            }

        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
                    <div className="mb-6">
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
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                        Log In
                    </button>
                </form>
                <p className="text-center text-slate-400 mt-6">
                    Don't have an account?{' '}
                    {/* Use navigate for switching to the register page */}
                    <button onClick={() => navigate('/register')} className="text-blue-400 hover:underline">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;