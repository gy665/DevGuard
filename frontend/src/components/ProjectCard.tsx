import React from 'react';
import { Project } from '../types';

// --- VulnerabilityChip Component ---

// 1. Define the props for the chip. THIS IS THE FIX FOR THE ERROR.
interface VulnerabilityChipProps {
  label: string;
  count: number;
  color: string;
}

// 2. Apply the types to the component.
const VulnerabilityChip: React.FC<VulnerabilityChipProps> = ({ label, count, color }) => (
  <div className="flex items-center mr-4">
    <div className={`w-2.5 h-2.5 rounded-full ${color} mr-1.5`}></div>
    <span className="font-bold text-white">{count}</span>
    <span className="ml-1 text-slate-400 text-sm">{label}</span>
  </div>
);


// --- ProjectCard Component ---



// 4. Define the props for the card.
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
        {/* This part will now work because VulnerabilityChip is correctly typed */}
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
      </div>
      <p className="text-xs text-slate-400">
        Last scanned: {project.lastScanned}
      </p>
    </div>
  );
};

export default ProjectCard;