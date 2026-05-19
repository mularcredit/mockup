import { AlertCircle, Clock, Briefcase } from 'lucide-react';

interface SummaryCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  isCount?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  AlertCircle,
  Clock,
  Briefcase
};

export const SummaryCard = ({
  label,
  value,
  icon,
  color,
  isCount = false,
}: SummaryCardProps) => {
  const colorClasses = {
    red: 'bg-red-500/10 text-red-400 border border-red-500/20',
    orange: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
  };

  const IconComponent = iconMap[icon];

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-5 shadow-sm hover:border-[var(--p)] hover:shadow-[0_0_15px_rgba(0,229,255,0.06)] transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {IconComponent && <IconComponent className="w-5 h-5" />}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-wider">{label}</p>
        <p className="text-white text-2xl font-bold">
          {isCount ? value : value.toLocaleString()}
        </p>
      </div>
    </div>
  );
};