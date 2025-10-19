import React, { useState } from 'react';
import { Github, Upload, Package, Play } from 'lucide-react';

const ScanInput = () => {
  const [activeTab, setActiveTab] = useState('repository');
  const [repoUrl, setRepoUrl] = useState('');

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex gap-2 mb-4 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('repository')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
            activeTab === 'repository'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Github className="w-4 h-4" />
          Repository
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
            activeTab === 'upload'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Upload className="w-4 h-4" />
          File Upload
        </button>
        <button
          onClick={() => setActiveTab('container')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
            activeTab === 'container'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Package className="w-4 h-4" />
          Container Image
        </button>
      </div>

      <div className="flex gap-3">
        {activeTab === 'repository' && (
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Enter public repository URL (e.g., https://github.com/user/repo)"
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        )}
        {activeTab === 'upload' && (
          <div className="flex-1 px-4 py-3 bg-slate-900 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 flex items-center justify-center hover:border-blue-500 transition-all cursor-pointer">
            <Upload className="w-5 h-5 mr-2" />
            <span>Click to upload or drag and drop files here</span>
          </div>
        )}
        {activeTab === 'container' && (
          <input
            type="text"
            placeholder="Enter container image (e.g., nginx:latest or docker.io/library/nginx:latest)"
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        )}
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/50">
          <Play className="w-4 h-4" />
          Start Scan
        </button>
      </div>
    </div>
  );
};

export default ScanInput;