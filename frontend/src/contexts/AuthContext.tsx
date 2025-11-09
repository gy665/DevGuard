import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Let's use jwt-decode to get user info


import  apiClient from '../api';

// Define the shape of the user object decoded from the JWT
interface User {
  userId: number;
  email: string;
}

// Define the shape of our context's value
interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean; // <-- ADD THIS
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // <-- ADD THIS, start as true

     useEffect(() => {
        const verifyStoredToken = async () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                try {
                    // Set auth header for our verification request
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    
                    // Ask the backend if this token is valid
                    const response = await apiClient.get('/auth/verify');
                    
                    // If the request succeeds, the token is valid.
                    setToken(storedToken);
                    setUser(response.data.user); // Set user from the API response
                } catch (error) {
                    // If the request fails (401), the token is invalid or expired.
                    console.error("Token verification failed, logging out.");
                    localStorage.removeItem('token'); // Clean up the bad token
                    setToken(null);
                    setUser(null);
                    // Also remove the bad header
                    delete apiClient.defaults.headers.common['Authorization'];
                }
            }
            // We are done checking, whether we found a token or not.
            setLoading(false);
        };

        verifyStoredToken();
    }, []);

     const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        const decodedUser: User = jwtDecode(newToken);
        setUser(decodedUser);
        // FIX: Set the auth header immediately on login for subsequent API calls
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

     const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        // FIX: Clear the auth header on logout
        delete apiClient.defaults.headers.common['Authorization'];
    };
    
    // Make sure to provide the new `loading` state in the context value
    const value = { token, user, loading, login, logout };

    

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};