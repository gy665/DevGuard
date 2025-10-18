import React, { useState, useEffect } from 'react';

const SeverityPieChart = ({ data }) => {
  const [animatedValues, setAnimatedValues] = useState({ critical: 0, high: 0, medium: 0, low: 0 });
  const [isAnimating, setIsAnimating] = useState(true);

  const total = data.critical + data.high + data.medium + data.low;

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        critical: Math.round(data.critical * easeProgress),
        high: Math.round(data.high * easeProgress),
        medium: Math.round(data.medium * easeProgress),
        low: Math.round(data.low * easeProgress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues(data);
        setIsAnimating(false);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [data]);

  const severities = [
    { name: 'Critical', value: animatedValues.critical, targetValue: data.critical, color: 'bg-red-500', textColor: 'text-red-500', strokeColor: '#ef4444' },
    { name: 'High', value: animatedValues.high, targetValue: data.high, color: 'bg-orange-500', textColor: 'text-orange-500', strokeColor: '#f97316' },
    { name: 'Medium', value: animatedValues.medium, targetValue: data.medium, color: 'bg-yellow-500', textColor: 'text-yellow-500', strokeColor: '#eab308' },
    { name: 'Low', value: animatedValues.low, targetValue: data.low, color: 'bg-blue-500', textColor: 'text-blue-500', strokeColor: '#3b82f6' }
  ];

  const animatedTotal = animatedValues.critical + animatedValues.high + animatedValues.medium + animatedValues.low;

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4">Vulnerabilities by Severity</h3>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {(() => {
              let offset = 0;
              return severities.map((severity, index) => {
                const percentage = total > 0 ? (severity.targetValue / total) * 100 : 0;
                const currentPercentage = animatedTotal > 0 ? (severity.value / total) * 100 : 0;
                const strokeDasharray = `${currentPercentage} ${100 - currentPercentage}`;
                const strokeDashoffset = -offset;
                offset += currentPercentage;

                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="15.9155"
                    fill="transparent"
                    stroke={severity.strokeColor}
                    strokeWidth="10"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))'
                    }}
                  />
                );
              });
            })()}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col animate-fade-in">
            <p className="text-3xl font-bold text-white transition-all duration-300">
              {animatedTotal}
            </p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {severities.map((severity, index) => (
          <div
            key={index}
            className="flex items-center gap-2 opacity-0 animate-slide-in"
            style={{ animationDelay: `${index * 100 + 300}ms`, animationFillMode: 'forwards' }}
          >
            <div className={`w-3 h-3 rounded-full ${severity.color}`}></div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">{severity.name}</p>
              <p className={`text-sm font-bold ${severity.textColor} transition-all duration-300`}>
                {severity.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeverityPieChart;