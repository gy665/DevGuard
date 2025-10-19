import React from 'react';
import { Plus } from 'lucide-react';
// This import will show an error until we convert ProjectCard.js
import ProjectCard from './ProjectCard';

// --- (This component is a placeholder for now) ---
// This allows the app to render while we build the backend and fetch real data.

const ProjectList: React.FC = () => {
    return (
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Projects</h2>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-all">
                    <Plus className="w-4 h-4" />
                    New Scan
                </button>
            </div>
            <div className="flex items-center justify-center h-48">
                <p className="text-slate-400">Project list will be displayed here.</p>
            </div>
        </div>
    );
};


// --- FULL CODE (TO BE USED LATER) ---
/*
// When you have project data, replace the placeholder above with this full version.

// 1. Define the shape of a single project object. This will be used by all child components.
interface Project {
  id: string | number;
  name: string;
  source: string;
  lastScan: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

// --- SecurityOverview Component ---

interface SecurityOverviewProps {
  projects: Project[];
}

const SecurityOverview: React.FC<SecurityOverviewProps> = ({ projects }) => {
    const totals = projects.reduce((acc, p) => {
        acc.critical += p.vulnerabilities.critical;
        acc.high += p.vulnerabilities.high;
        return acc;
    }, { critical: 0, high: 0 });

    return (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-4">
            <h3 className="text-xl font-bold text-white mb-3">Security Overview</h3>
            <p className="text-slate-300">
                <span className="text-red-500 font-bold text-2xl">{totals.critical}</span>
                <span className="text-slate-400 ml-2">Critical vulnerabilities</span>
            </p>
            <p className="text-slate-300 mt-2">
                <span className="text-orange-500 font-bold text-2xl">{totals.high}</span>
                <span className="text-slate-400 ml-2">High vulnerabilities</span>
            </p>
        </div>
    );
};

// --- ProjectList Component ---

interface ProjectListProps {
  projects: Project[];
  selectedProjectId: string | number | null;
  onProjectSelect: (id: string | number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, selectedProjectId, onProjectSelect }) => {
  // Handle case with no projects
  if (!projects || projects.length === 0) {
    return (
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 h-full">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Projects</h2>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-all">
                    <Plus className="w-4 h-4" />
                    New Scan
                </button>
            </div>
            <div className="flex items-center justify-center h-48">
                <p className="text-slate-400">No projects found. Start a new scan to begin.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" />
          New Scan
        </button>
      </div>

      <SecurityOverview projects={projects} />

      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isSelected={project.id === selectedProjectId}
          onClick={() => onProjectSelect(project.id)}
        />
      ))}
    </div>
  );
};
*/

export default ProjectList;