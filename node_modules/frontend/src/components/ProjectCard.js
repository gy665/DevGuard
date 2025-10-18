import React from 'react';

const VulnerabilityChip = ({ label, count, color }) => (
  <div className="flex items-center mr-4">
    <div className={`w-2.5 h-2.5 rounded-full ${color} mr-1.5`}></div>
    <span className="font-bold text-white">{count}</span>
    <span className="ml-1 text-slate-400 text-sm">{label}</span>
  </div>
);

const ProjectCard = ({ project, isSelected, onClick }) => {
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
      </div>
      <p className="text-xs text-slate-400">
        Last scanned: {project.lastScanned}
      </p>
    </div>
  );
};

export default ProjectCard;