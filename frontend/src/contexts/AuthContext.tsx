import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

// --- (CORRECTION) ---
// Corrected API URL to match your backend routes
const API_URL = 'http://localhost:5001/api/auth';

// Type for the User object we'll store in the frontend state
interface UserInfo {
  id: string;
  email: string;
}

// Define the shape of the context's value
interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// The Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load token and user from local storage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- (IMPROVEMENT) Added error handling ---
  const register = async (email: string, password: string) => {
    try {
      await axios.post(`${API_URL}/register`, { email, password });
    } catch (error: any) {
      // Re-throw a clean error message for the UI to catch
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('An unexpected error occurred during registration.');
    }
  };

  // --- (IMPROVEMENT) Added error handling ---
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error: any) {
      // Re-throw a clean error message for the UI to catch
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('An unexpected error occurred during login.');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};