import React from 'react';
import { Activity, Cpu, Network } from 'lucide-react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 text-white shadow-md shadow-cyan-600/20 ${className}`}>
      <Activity className="w-5 h-5 absolute animate-pulse text-cyan-200" />
      <Network className="w-5 h-5 opacity-90" />
    </div>
  );
};
