import React, { useState } from 'react';
import { Shield, Mail, Lock, UserPlus } from 'lucide-react';

// Define the types for the props this component receives
interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegister: (email: string, password: string) => Promise<any>; // Changed to Promise<any>
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onRegister(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  // All your JSX below remains exactly the same
  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
           <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">DevGuard</h1>
          </div>
          <p className="text-slate-400">Create a new account</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
             {/* ... form content ... */}
             {error && (<div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">{error}</div>)}
             <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="you@example.com"/></div>
             </div>
             <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="••••••••"/></div>
             </div>
             <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/50">
                {loading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Creating account...</>) : (<><UserPlus className="w-4 h-4" />Create Account</>)}
             </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-slate-400">Already have an account?{' '}<button onClick={onSwitchToLogin} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign in</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;