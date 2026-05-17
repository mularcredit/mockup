import React from 'react';
import { TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  type?: 'primary' | 'success' | 'default';
  icon?: React.ElementType;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  subtitle,
  type = 'default',
  icon: Icon = TrendingUp
}: StatsCardProps) {
  
  const typeClasses = {
    primary: 'm-p bg-gradient-to-br from-[rgba(245,166,35,0.15)] to-[rgba(245,166,35,0.05)] border-[var(--p-glow)]',
    success: 'm-g bg-gradient-to-br from-[rgba(0,245,155,0.15)] to-[rgba(0,245,155,0.05)] border-[var(--green-glow)]',
    default: 'm-d bg-[var(--card)] border-[var(--p-line)]'
  };

  const badgeClasses = {
    positive: 'bg-[var(--green-d)] text-[var(--green)]',
    negative: 'bg-[var(--red-d)] text-[var(--red)]',
    neutral: 'bg-[var(--p-dim)] text-[var(--p)]'
  };
  
  return (
    <div className={`metric-tile ${typeClasses[type]} p-5 rounded-xl border backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-2xl group relative overflow-hidden`}>
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-8 h-8" />
      </div>
      
      {change && (
        <div className={`inline-flex mb-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeClasses[changeType]} shadow-sm`}>
          {change}
        </div>
      )}
      
      <div className="relative z-10">
        <div className="text-[24px] font-medium text-[var(--t1)] leading-none mb-1.5 tracking-tight tabular-nums">
          {value}
        </div>
        <div className="text-[11px] text-[var(--t3)] tracking-wider font-medium">
          {title}
        </div>
        
        {subtitle && (
          <div className="text-[10px] text-[var(--t4)] mt-3 pt-3 border-t border-[var(--p-line)] leading-relaxed">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}