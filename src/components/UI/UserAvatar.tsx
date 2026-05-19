import React from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';

interface UserAvatarProps {
  name?: string;
  size?: number;
  showStatus?: boolean;
  className?: string;
  family?: 'notionists' | 'open-peeps' | 'rings' | 'shapes' | 'glass' | 'initials' | 'thumbs' | 'lorelei' | 'bottts';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name = 'Anonymous', 
  size = 32, 
  showStatus = true,
  className = '',
  family // Optional - if not provided, falls back to original global Nice-Avatar face
}) => {
  // If family is explicitly provided, render the clean Dicebear vector family
  if (family) {
    const avatarUrl = `https://api.dicebear.com/7.x/${family}/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=0f172a,1e1b4b,020617`;
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
        {showStatus && (
          <>
            <div className="absolute inset-0 rounded-full bg-[#00E5FF] opacity-15 animate-ping scale-125" />
            <div className="absolute inset-0 rounded-full bg-[#00E5FF33] animate-pulse scale-110" />
          </>
        )}
        <div 
          className="relative rounded-full overflow-hidden flex items-center justify-center bg-slate-900 border"
          style={{ 
            width: size, 
            height: size,
            borderColor: 'rgba(0, 229, 255, 0.15)'
          }}
        >
          <img 
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover rounded-full bg-slate-950"
            loading="lazy"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>
        {showStatus && (
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#090d16] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        )}
      </div>
    );
  }

  // DEFAULT GLOBAL: Render the original react-nice-avatar
  const config = genConfig(name);

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      {/* Pulsing Gold / Cyan Ring Effect */}
      {showStatus && (
        <>
          <div className="absolute inset-0 rounded-full bg-[#00E5FF] opacity-20 animate-ping scale-125" />
          <div className="absolute inset-0 rounded-full bg-[#00E5FF33] animate-pulse scale-110" />
        </>
      )}
      
      {/* Avatar Container with Cyan Glassmorphic Border */}
      <div 
        className="relative rounded-full overflow-hidden flex items-center justify-center bg-[var(--p-dim)]"
        style={{ 
          width: size, 
          height: size,
          border: '0.5px solid rgba(0, 229, 255, 0.2)'
        }}
      >
        <Avatar 
          style={{ width: '100%', height: '100%' }} 
          {...config} 
        />
      </div>
      
      {/* Small Online Dot Indicator */}
      {showStatus && (
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#090d16] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
      )}
    </div>
  );
};

export default UserAvatar;
