import React, { useState } from 'react';
import axios from 'axios';
import Login from './Login.tsx';
import Register from './Register.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';

const API_URL = 'http://localhost:5001/api/auth';

const AuthPage: React.FC = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);

  // Get the GLOBAL login function from our context
  const { login } = useAuth();

  // A local function for handling registration
  const handleRegister = async (email: string, password: string) => {
    try {
      await axios.post(`${API_URL}/register`, { email, password });
      alert('Registration successful! Please log in.');
      setIsLoginForm(true); // Switch to the login form after success
    } catch (error: any) {
      alert(error.response?.data?.error || "Registration failed.");
    }
  };

  if (isLoginForm) {
    return (
      <Login 
        onSwitchToRegister={() => setIsLoginForm(false)}
        // Pass the powerful `login` function from the context
        onLogin={login}
      />
    );
  } else {
    return (
      <Register 
        onSwitchToLogin={() => setIsLoginForm(true)}
        onRegister={handleRegister}
      />
    );
  }
};

export default AuthPage;