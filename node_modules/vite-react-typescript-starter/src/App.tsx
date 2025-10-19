

import React from 'react';
import './App.css'; // This should exist from our earlier steps
import AuthPage from './components/AuthPage'; // Import the AuthPage component

const App: React.FC = () => {
  // Right now, the entire application will just be our authentication page.
  // Later, we will add logic here to show the main dashboard after a successful login.
  return (
    <div>
      <AuthPage />
    </div>
  );
}

export default App;