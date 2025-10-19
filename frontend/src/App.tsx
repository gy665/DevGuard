// frontend/src/App.tsx
import AuthPage from './components/AuthPage.tsx';
import HomePage from './components/HomePage.jsx';
import { useAuth } from './contexts/AuthContext.tsx';

const App: React.FC = () => {
  const { token } = useAuth();
  return (
    <div>
      {token ? <HomePage /> : <AuthPage />}
    </div>
  );
}
export default App;