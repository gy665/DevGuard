import React from 'react';
import { XCircle, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

// Define the types for the component's props for type safety
interface StatCardProps {
  label: 'Critical' | 'High' | 'Medium' | 'Low';
  count: number;
}

// A map to hold the specific styles for each severity type
const severityStyles = {
  Critical: {
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    textColor: 'text-red-500',
    borderColor: 'border-red-500/50',
    barColor: 'bg-red-500',
  },
  High: {
    icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500/50',
    barColor: 'bg-orange-500',
  },
  Medium: {
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-500/50',
    barColor: 'bg-yellow-500',
  },
  Low: {
    icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/50',
    barColor: 'bg-blue-500',
  },
};

const StatCard: React.FC<StatCardProps> = ({ label, count }) => {
  const styles = severityStyles[label];

  return (
    <div className={`bg-slate-800 p-5 rounded-lg border ${styles.borderColor}`}>
      <div className="flex items-center justify-between">
        <p className={`font-medium ${styles.textColor}`}>{label}</p>
        {styles.icon}
      </div>
      <p className="text-3xl font-bold text-white mt-2">{count}</p>
      <div className="w-full bg-slate-700 h-1 rounded-full mt-3 overflow-hidden">
        <div className={`${styles.barColor} h-full rounded-full`} style={{ width: '100%' }}></div>
      </div>
    </div>
  );
};

export default StatCard;