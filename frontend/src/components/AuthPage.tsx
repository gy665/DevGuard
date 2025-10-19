import React, { useState } from 'react';
import axios from 'axios';
import Login from './Login';      // Assuming Login.jsx is in the same folder
import Register from './Register';  // Assuming Register.jsx is in the same folder

const API_URL = 'http://localhost:5001/api/auth';

// We explicitly type the component as a React Functional Component
const AuthPage: React.FC = () => {
  // We tell TypeScript that this state will always be a boolean (true/false)
  const [showLogin, setShowLogin] = useState<boolean>(true);

  // --- API Logic ---

  const handleLogin = async (email: string, password: string) => {
    // We type the function arguments
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log('Login successful:', response.data);
    alert('Login successful! Check the console.');
  };

  const handleRegister = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    console.log('Registration successful:', response.data);
    alert('Registration successful! Now please log in.');
    setShowLogin(true);
  };

  // --- Render Logic ---

  if (showLogin) {
    return (
      <Login 
        onSwitchToRegister={() => setShowLogin(false)}
        onLogin={handleLogin}
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