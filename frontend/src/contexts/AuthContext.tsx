import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Let's use jwt-decode to get user info

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

    // This effect runs only ONCE when the app starts up
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                const decodedUser: User = jwtDecode(storedToken);
                setUser(decodedUser);
            }
        } catch (error) {
            // If token is invalid or expired, it will fail here. We ensure user is logged out.
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            // This is crucial. We are done checking. Set loading to false.
            setLoading(false);
        }
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        const decodedUser: User = jwtDecode(newToken);
        setUser(decodedUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
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