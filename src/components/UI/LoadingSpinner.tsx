import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading Telemetry", 
  fullPage = false 
}) => {
  return (
    <div className={`flex flex-col justify-center items-center gap-6 relative overflow-hidden backdrop-blur-sm ${fullPage ? 'h-screen w-full' : 'h-[50vh] w-full bg-[var(--card)]/10 rounded-2xl border border-white/[0.03]'}`}>
      {/* Ambient Pulsing Glow */}
      <div className="absolute w-64 h-64 rounded-full bg-cyan-500/10 blur-[80px] -z-10 animate-pulse" />
      
      {/* Multi-Ring Elegant Spinner */}
      <div className="relative w-16 h-16">
        {/* Outer Spin Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 border-r-cyan-500/35 animate-spin" style={{ animationDuration: '1.2s' }} />
        {/* Inner Pulse Ring */}
        <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/25 animate-pulse" />
        {/* Inner Spin Ring Counter */}
        <div className="absolute inset-3 rounded-full border border-transparent border-b-cyan-400 border-l-cyan-400/15 animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }} />
        {/* Center Core Glow */}
        <div className="absolute inset-5 rounded-full bg-cyan-500/20 animate-pulse" />
      </div>
      
      <div className="flex flex-col items-center gap-1.5 z-10">
        <span className="text-white font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
          {message}
        </span>
        <span className="text-[var(--t3)] text-[9px] font-medium tracking-[0.1em]">
          Securing verification pathway...
        </span>
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent mt-1" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
