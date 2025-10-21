


// --- FULL CODE (TO BE USED LATER) ---

// When you are ready to feed real data to this component,
// replace the placeholder code above with this full version.

import React from 'react';
import { AlertCircle } from 'lucide-react';

// 1. Define the shape of a single project's data.
interface ProjectData {
  name: string;
  vulnerabilities: number;
}

// 2. Define the shape of the props object for this component.
interface BarChartProps {
  data: ProjectData[]; // It's an array of ProjectData objects
}

const TopProjectsBarChart: React.FC<BarChartProps> = ({ data }) => {
  // Handle the case of empty data to prevent errors
  if (!data || data.length === 0) {
    return (
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 h-full">
            <h3 className="text-xl font-bold text-white mb-4">Top 5 Vulnerable Projects</h3>
            <div className="flex items-center justify-center h-full">
                <p className="text-slate-400">No project data available.</p>
            </div>
        </div>
    );
  }

  const maxVulnerabilities = Math.max(...data.map(p => p.vulnerabilities), 1); // Use 1 as a minimum to avoid division by zero

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4">Top 5 Vulnerable Projects</h3>

      <div className="flex-1 space-y-4">
        {data.map((project, index) => {
          // Ensure percentage is between 0 and 100
          const percentage = Math.max(0, Math.min(100, (project.vulnerabilities / maxVulnerabilities) * 100));

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-medium truncate flex-1 mr-2">
                  {project.name}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {project.vulnerabilities}
                </span>
              </div>
              <div className="h-8 bg-slate-900 rounded-lg overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 flex items-center justify-end pr-3"
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 20 && (
                    <span className="text-white text-xs font-semibold">
                      {project.vulnerabilities}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default TopProjectsBarChart;