import React from 'react';
import { Github, Clock, ArrowRight } from 'lucide-react';

// 1. Define the shape of a single activity item.
interface ActivityItem {
  id: string | number;
  repoName: string;
  timestamp: string; // e.g., "3 hours ago"
}

// 2. Define the props for the component.
interface RecentActivityProps {
  activity: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activity }) => {
  // Handle case with no activity
  if (!activity || activity.length === 0) {
    return (
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 h-full">
            <h3 className="text-xl font-bold text-white mb-4">Recent Scan Activity</h3>
            <div className="flex items-center justify-center h-full">
                <p className="text-slate-400">No recent activity to show.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Recent Scan Activity</h3>
      <div className="space-y-4">
        {activity.map(item => (
          <div key={item.id} className="border-l-2 border-blue-500 pl-4 py-2 hover:border-blue-400 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Github className="w-5 h-5 text-blue-400" />
              <p className="text-slate-300">
                Repository scan on <span className="font-bold text-white">{item.repoName}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm ml-7">
              <Clock className="w-4 h-4" />
              <span>{item.timestamp}</span>
            </div>
            <a
              href="#"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm ml-7 mt-2 transition-colors group"
            >
              View Report
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;