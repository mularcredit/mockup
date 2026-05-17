import React from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';

interface UserAvatarProps {
  name?: string;
  size?: number;
  showStatus?: boolean;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name = 'Anonymous', 
  size = 32, 
  showStatus = true,
  className = ''
}) => {
  // Generate consistent config based on the name/seed
  const config = genConfig(name);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Pulsing Gold Ring Effect */}
      {showStatus && (
        <>
          <div className="absolute inset-0 rounded-full bg-[#C8A84B] opacity-20 animate-ping scale-125" />
          <div className="absolute inset-0 rounded-full bg-[#C8A84B33] animate-pulse scale-110" />
        </>
      )}
      
      {/* Avatar Container with Gold Border */}
      <div 
        className="relative rounded-full overflow-hidden flex items-center justify-center bg-[var(--p-dim)]"
        style={{ 
          width: size, 
          height: size,
          border: '0.5px solid #C8A84B33'
        }}
      >
        <Avatar 
          style={{ width: '100%', height: '100%' }} 
          {...config} 
        />
      </div>
      
      {/* Small Online Dot (optional, but requested "pulsing gold ring background animation to indicate an active/online status") */}
      {showStatus && (
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[var(--sidebar)] shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
      )}
    </div>
  );
};

export default UserAvatar;
