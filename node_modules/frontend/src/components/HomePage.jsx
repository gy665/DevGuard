import React, { useState } from 'react';
import { Shield, Github, Upload, Package, AlertCircle, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import ScanInput from './ScanInput';
import SeverityPieChart from './SeverityPieChart';
import TopProjectsBarChart from './TopProjectsBarChart';

const mockData = {
  severityCounts: { critical: 12, high: 28, medium: 45, low: 63 },
  topProjects: [
    { name: 'frontend-app', vulnerabilities: 45 },
    { name: 'backend-api', vulnerabilities: 38 },
    { name: 'mobile-client', vulnerabilities: 32 },
    { name: 'admin-dashboard', vulnerabilities: 28 },
    { name: 'microservice-auth', vulnerabilities: 25 }
  ]
};

const HomePage = () => {
  const totalVulnerabilities = mockData.severityCounts.critical +
                               mockData.severityCounts.high +
                               mockData.severityCounts.medium +
                               mockData.severityCounts.low;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Security Scanner</h1>
          </div>
          <p className="text-slate-400 text-lg">Identify and track vulnerabilities across your projects</p>
        </div>

        <div className="space-y-6">

          <ScanInput />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-red-500 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">Critical</span>
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-white">{mockData.severityCounts.critical}</p>
              <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${(mockData.severityCounts.critical / totalVulnerabilities) * 100}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-orange-500 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">High</span>
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-white">{mockData.severityCounts.high}</p>
              <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${(mockData.severityCounts.high / totalVulnerabilities) * 100}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-yellow-500 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">Medium</span>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-white">{mockData.severityCounts.medium}</p>
              <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: `${(mockData.severityCounts.medium / totalVulnerabilities) * 100}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">Low</span>
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-white">{mockData.severityCounts.low}</p>
              <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${(mockData.severityCounts.low / totalVulnerabilities) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Security Overview</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 h-full">
                <SeverityPieChart data={mockData.severityCounts} />
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 h-full">
                <TopProjectsBarChart data={mockData.topProjects} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;