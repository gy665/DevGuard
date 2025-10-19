import React, { useState } from 'react';
import axios from 'axios';
import Login from './Login.tsx';
import Register from './Register.tsx';
import { useAuth } from '../contexts/AuthContext.tsx'; // 1. IMPORT THE HOOK

// We need the correct API URL for the register function
const API_URL = 'http://localhost:5001/api/auth';

const AuthPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState<boolean>(true);
  
  // 2. GET THE LOGIN FUNCTION FROM OUR GLOBAL CONTEXT
  const { login } = useAuth();

  // The local `handleLogin` function is now GONE.

  // The register function can stay here for now, as it's simpler.
  const handleRegister = async (email: string, password: string) => {
    try {
        await axios.post(`${API_URL}/register`, { email, password });
        alert('Registration successful! Now please log in.');
        setShowLogin(true); // Switch to login form
    } catch (error: any) {
        // You can add more robust error handling here if you like
        alert(error.response?.data?.error || "Registration failed.");
    }
  };

  if (showLogin) {
    return (
      <Login 
        onSwitchToRegister={() => setShowLogin(false)}
        // 3. PASS THE GLOBAL `login` FUNCTION AS A PROP
        onLogin={login}
      />
    );
  } else {
    return (
      <Register 
        onSwitchToLogin={() => setShowLogin(true)}
        onRegister={handleRegister}
      />
    );
  }
};

export default AuthPage;