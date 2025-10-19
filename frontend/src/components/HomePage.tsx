import React from 'react';
import { useAuth } from '../contexts/AuthContext';

// We will import all your dashboard components.
// These lines will show errors until we convert each file to .tsx
import ScanInput from './ScanInput';
import SeverityPieChart from './SeverityPieChart';
import TopProjectsBarChart from './TopProjectsBarChart';
import VulnerabilityReport from './VulnerabilityReport';
import ProjectList from './ProjectList'; // Assuming you'll want this too
import RecentActivity from './RecentActivity'; // And this

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  // We will need state to hold the scan results later
  // const [scanResults, setScanResults] = useState(null);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user?.email}</p>
        </div>
        <button 
          onClick={logout}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </header>

      <main>
        {/* Section for initiating scans */}
        <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Start a New Scan</h2>
          <ScanInput />
        </section>

        {/* Grid for charts and reports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-8">
            <VulnerabilityReport />
            <ProjectList />
          </div>

          {/* Sidebar area */}
          <div className="space-y-8">
            <SeverityPieChart />
            <TopProjectsBarChart />
            <RecentActivity />
          </div>

        </div>
      </main>
    </div>
  );
};

export default HomePage;