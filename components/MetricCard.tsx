import React from 'react';
import { Activity, Cpu, Zap, HardDrive } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: 'latency' | 'cpu' | 'gpu' | 'accuracy';
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, icon, color, trend }) => {
  const getIcon = () => {
    switch (icon) {
      case 'latency': return <Zap className="w-5 h-5" />;
      case 'cpu': return <Cpu className="w-5 h-5" />;
      case 'gpu': return <HardDrive className="w-5 h-5" />;
      case 'accuracy': return <Activity className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4 flex items-start justify-between hover:border-slate-600 transition-all duration-300">
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {value}
          {unit && <span className="text-sm text-slate-500 font-normal ml-1">{unit}</span>}
        </h3>
      </div>
      <div 
        className="p-2 rounded-lg bg-opacity-20"
        style={{ backgroundColor: `${color}20`, color: color }}
      >
        {getIcon()}
      </div>
    </div>
  );
};

export default MetricCard;