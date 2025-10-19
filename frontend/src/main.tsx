import React from 'react';
import ReactDOM from 'react-dom/client'; // <-- This is the missing import
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';

// Get the root element from your HTML
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create the root
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);