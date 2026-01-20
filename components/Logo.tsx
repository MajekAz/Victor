
import React from 'react';
import { COLORS } from '../constants';

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-10", isDark = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon portion: stylized bowtie triangles */}
      <svg 
        viewBox="0 0 100 100" 
        className="h-full w-auto" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 25 L50 50 L0 75 Z" fill={COLORS.secondary} />
        <path d="M50 50 L100 25 L100 75 Z" fill={COLORS.primary} />
        <path d="M50 50 L0 50 L50 25 Z" fill={COLORS.primary} opacity="0.8" />
      </svg>
      
      {/* Text portion */}
      <div className="flex flex-col justify-center">
        <span 
          className={`text-2xl font-[900] tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'}`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          PROMARCH
        </span>
        <span 
          className="text-[10px] font-black tracking-[0.25em] uppercase mt-0.5"
          style={{ color: COLORS.secondary }}
        >
          CONSULTING
        </span>
      </div>
    </div>
  );
};
