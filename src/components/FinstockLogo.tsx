import React from 'react';

interface FinstockLogoProps {
  variant?: 'full' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const FinstockLogo: React.FC<FinstockLogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  // Original vector logo: A multi-faceted hexagonal crest with dynamic ascending financial energy waves,
  // representing algorithmic liquidity, institutional security, and upward wealth momentum.
  const LogoIcon = (
    <div className={`relative ${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 p-[1.5px] shadow-lg shadow-blue-900/30 group-hover:shadow-blue-500/50 transition-all duration-300`}>
      <div className="w-full h-full bg-[#080d1a] rounded-[10px] flex items-center justify-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-amber-400/20 pointer-events-none" />
        
        {/* Precision SVG Monogram & Energy Nodes */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[82%] h-[82%] relative z-10"
        >
          <defs>
            <linearGradient id="fstGrad1" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="0.5" stopColor="#6366F1" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="fstGrad2" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="fstGold" x1="20" y1="6" x2="42" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Outer Hexagon Shield Perimeter */}
          <path
            d="M24 3L41.32 13V33L24 43L6.68 33V13L24 3Z"
            stroke="url(#fstGrad1)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Ascending Financial Graph Ribbon / Interlocking 'F' & 'S' */}
          <path
            d="M15 31L22 23L27 28L34 16"
            stroke="url(#fstGrad2)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Top 'F' Bar Accent */}
          <path
            d="M16 14H32"
            stroke="url(#fstGold)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M16 21H27"
            stroke="url(#fstGold)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Upper Right Apex Star / Growth Node */}
          <circle cx="34" cy="16" r="3" fill="#F59E0B" />
          <circle cx="34" cy="16" r="1.2" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{LogoIcon}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {LogoIcon}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-wider text-white ${textSizes[size]}`}>
            FINSTOCK<span className="text-amber-400">COIN</span>
          </span>
          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-extrabold uppercase tracking-wide">
            FIU-IND
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
            Trade Smarter. Grow Stronger.
          </span>
        )}
      </div>
    </div>
  );
};
