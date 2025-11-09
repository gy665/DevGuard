// frontend/src/components/HomePage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { DashboardData, Project, Vulnerability } from '../types';

// --- YOUR ORIGINAL COMPONENT IMPORTS ---
import { Shield } from 'lucide-react';
import ScanInput from './ScanInput';
import SeverityPieChart from './SeverityPieChart';
import TopProjectsBarChart from './TopProjectsBarChart';
import VulnerabilityReport from './VulnerabilityReport';
import ProjectList from './ProjectList';
import StatCard from './StatCard';

const HomePage: React.FC = () => {
    // --- AUTHENTICATION & STATE HOOKS ---
    const { user, logout, token } = useAuth();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | number | null>(null);
    const [selectedProjectVulnerabilities, setSelectedProjectVulnerabilities] = useState<Vulnerability[]>([]);
    
    // --- ADD THIS TRIGGER STATE ---
    const [scanCounter, setScanCounter] = useState(0);

    // --- REFRESH FUNCTION ---
    const refreshDashboard = () => {
        setScanCounter(prev => prev + 1); // Incrementing this will re-trigger the useEffect
    };

    // --- EFFECT TO FETCH LIVE DATA ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            // The ProtectedRoute handles the initial check, but this is good practice
            if (!token) return;

            setLoading(true);
            try {
                // --- THE REAL API CALL ---
                const response = await axios.get('http://localhost:5001/api/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setData(response.data);
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [token, scanCounter]); // <-- ADD scanCounter to the dependency array

    // --- LOADING AND ERROR STATES ---
    if (loading) {
        return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading Dashboard...</div>;
    }
    if (error || !data) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">{error || 'Could not load data.'}</div>
                    <button 
                        onClick={refreshDashboard}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // --- YOUR FULL, ORIGINAL UI (Now with real data) ---
    const selectedProject = data.projects.find(p => p.id === selectedProjectId);
    const { severityOverview } = data;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 sm:p-8 lg:p-10">
            {/* --- Header --- */}
            <header className="flex items-start sm:items-center justify-between mb-8 flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-blue-400" />
                    <div>
                        <h1 className="text-2xl font-bold">DevGuard</h1>
                        <p className="text-slate-400 text-sm">Identify and track vulnerabilities across your projects</p>
                    </div>
                </div>
                <div className="flex items-center self-end sm:self-center gap-4">
                    <button 
                        onClick={refreshDashboard}
                        className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                    >
                        Refresh
                    </button>
                    <span className="text-slate-400 text-sm mr-4 hidden md:inline">Welcome, {user?.email}</span>
                    <button onClick={logout} className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                        Logout
                    </button>
                </div>
            </header>
            
            {/* The rest of your UI is exactly the same as in Phase 1 */}
            <main className="space-y-8">
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    {/* Pass the refresh function down as a prop */}
                    <ScanInput onScanComplete={refreshDashboard} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Critical" count={severityOverview.critical} />
                    <StatCard label="High" count={severityOverview.high} />
                    <StatCard label="Medium" count={severityOverview.medium} />
                    <StatCard label="Low" count={severityOverview.low} />
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Security Overview</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                <SeverityPieChart data={severityOverview} />
                            </div>
                            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                <TopProjectsBarChart data={data.topProjects} />
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                <VulnerabilityReport 
                                    project={selectedProject || null} 
                                    vulnerabilities={selectedProjectVulnerabilities} 
                                />
                            </div>
                            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                <ProjectList 
                                    projects={data.projects} 
                                    selectedProjectId={selectedProjectId}
                                    onProjectSelect={setSelectedProjectId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;