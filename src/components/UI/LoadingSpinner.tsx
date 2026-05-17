import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading", 
  fullPage = false 
}) => {
  return (
    <div className={`flex flex-col justify-center items-center gap-8 ${fullPage ? 'h-screen w-full' : 'h-[60vh] w-full'}`}>
      <div className="relative w-12 h-12">
        {/* Fade Loader Bars */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-0 w-[6%] h-[32%] bg-[var(--p)] rounded-full animate-fade -translate-x-1/2"
            style={{
              transform: `rotate(${i * 45}deg)`,
              transformOrigin: '50% 155%',
              animationDelay: `${i * 0.125}s`,
              boxShadow: '0 0 10px var(--gold-glow)'
            }}
          />
        ))}
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-bold text-[var(--p)] tracking-[0.4em] animate-pulse">
          {message}
        </span>
        <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[var(--p-line)] to-transparent" />
      </div>

      <style>{`
        @keyframes fade {
          0% { opacity: 1; }
          100% { opacity: 0.1; }
        }
        .animate-fade {
          animation: fade 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
