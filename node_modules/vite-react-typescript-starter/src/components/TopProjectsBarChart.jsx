import React from 'react';
import { AlertCircle } from 'lucide-react';

const TopProjectsBarChart = ({ data }) => {
  const maxVulnerabilities = Math.max(...data.map(p => p.vulnerabilities));

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4">Top 5 Vulnerable Projects</h3>

      <div className="flex-1 space-y-4">
        {data.map((project, index) => {
          const percentage = (project.vulnerabilities / maxVulnerabilities) * 100;

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