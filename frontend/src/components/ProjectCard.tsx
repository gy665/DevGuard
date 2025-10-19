import React from 'react';

// --- VulnerabilityChip Component ---

// 1. Define the props for the chip.
interface VulnerabilityChipProps {
  label: string;
  count: number;
  color: string;
}

const VulnerabilityChip: React.FC<VulnerabilityChipProps> = ({ label, count, color }) => (
  <div className="flex items-center mr-4">
    <div className={`w-2.5 h-2.5 rounded-full ${color} mr-1.5`}></div>
    <span className="font-bold text-white">{count}</span>
    <span className="ml-1 text-slate-400 text-sm">{label}</span>
  </div>
);


// --- ProjectCard Component ---

// 2. We need to define the shape of the 'project' prop.
// For consistency, we can import this from ProjectList.tsx in the future,
// but for now, defining it here is fine.
interface Project {
  id: string | number;
  name: string;
  lastScanned: string; // Changed from lastScan for consistency with your code
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

// 3. Define the props for the card.
interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-800 rounded-lg p-5 border-2 transition-all cursor-pointer hover:shadow-lg ${
        isSelected
          ? 'border-blue-500 shadow-lg shadow-blue-500/20'
          : 'border-slate-700 hover:border-slate-600'
      }`}
    >
      <h3 className="text-lg font-semibold text-white mb-3">{project.name}</h3>
      <div className="flex my-3">
        <VulnerabilityChip
          label="Critical"
          count={project.vulnerabilities.critical}
          color="bg-red-500"
        />
        <VulnerabilityChip
          label="High"
          count={project.vulnerabilities.high}
          color="bg-orange-500"
        />
        {/* You could easily add Medium and Low chips here as well */}
      </div>
      <p className="text-xs text-slate-400">
        Last scanned: {project.lastScanned}
      </p>
    </div>
  );
};

export default ProjectCard;