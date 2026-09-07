import React from 'react';

interface GtItemIconProps {
  type: 'dl' | 'bgl' | 'wl' | 'rayman' | 'magplant' | 'ghc' | 'wings' | 'geiger';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GtItemIcon: React.FC<GtItemIconProps> = ({ type, className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const dim = sizeMap[size] || sizeMap.md;

  // Authentic retro Growtopia pixel art sprites
  if (type === 'dl') {
    // Diamond Lock: Cyan blue faceted diamond lock with metallic shackle
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900 border border-cyan-500/30 shadow-sm ${dim} ${className}`}>
        <svg viewBox="0 0 24 24" className="w-4/5 h-4/5 image-rendering-pixelated" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shackle */}
          <path d="M8 9V6C8 3.79 9.79 2 12 2C14.21 2 16 3.79 16 6V9" stroke="#E0F2FE" strokeWidth="2.2" strokeLinecap="square" />
          {/* Diamond Body */}
          <path d="M12 7L19 12L12 22L5 12L12 7Z" fill="#06B6D4" stroke="#0891B2" strokeWidth="1" />
          {/* Facets */}
          <path d="M5 12H19" stroke="#67E8F9" strokeWidth="1" />
          <path d="M12 7V22" stroke="#22D3EE" strokeWidth="1" />
          <path d="M12 12L8 9.5M12 12L16 9.5M12 12L8 16.5M12 12L16 16.5" stroke="#CFFAFE" strokeWidth="0.9" />
          {/* Pixel highlights */}
          <rect x="11" y="11" width="2" height="2" fill="#FFFFFF" />
          <rect x="7" y="11" width="1.5" height="1.5" fill="#E0F2FE" />
        </svg>
      </div>
    );
  }

  if (type === 'bgl') {
    // Blue Gem Lock: Royal Blue glowing gem lock
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900 border border-blue-500/30 shadow-sm ${dim} ${className}`}>
        <svg viewBox="0 0 24 24" className="w-4/5 h-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shackle */}
          <path d="M8 9V6C8 3.79 9.79 2 12 2C14.21 2 16 3.79 16 6V9" stroke="#93C5FD" strokeWidth="2.2" strokeLinecap="square" />
          {/* Gem Body */}
          <path d="M7 9H17L20 13L12 22L4 13L7 9Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1" />
          {/* Facet lines */}
          <path d="M4 13H20M12 9V22M7 9L12 22M17 9L12 22" stroke="#60A5FA" strokeWidth="0.8" />
          {/* Gem Sparkle */}
          <rect x="9" y="11" width="2" height="2" fill="#FFFFFF" />
          <rect x="15" y="14" width="1.5" height="1.5" fill="#BFDBFE" />
        </svg>
      </div>
    );
  }

  if (type === 'wl') {
    // World Lock: Classic bronze globe lock
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900 border border-amber-500/30 shadow-sm ${dim} ${className}`}>
        <svg viewBox="0 0 24 24" className="w-4/5 h-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shackle */}
          <path d="M8 9V6C8 3.79 9.79 2 12 2C14.21 2 16 3.79 16 6V9" stroke="#FDE68A" strokeWidth="2.2" strokeLinecap="square" />
          {/* Lock Body */}
          <rect x="5" y="9" width="14" height="12" rx="1" fill="#D97706" stroke="#B45309" strokeWidth="1" />
          {/* Globe meridian */}
          <circle cx="12" cy="15" r="4" fill="#92400E" stroke="#FBBF24" strokeWidth="0.8" />
          <path d="M12 11V19M8 15H16" stroke="#FDE68A" strokeWidth="0.8" />
          <rect x="11.5" y="14.5" width="1.2" height="1.2" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  if (type === 'rayman') {
    // Rayman's Fist: Boxing glove
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900 border border-yellow-500/30 shadow-sm ${dim} ${className}`}>
        <svg viewBox="0 0 24 24" className="w-4/5 h-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="7" width="13" height="11" rx="3" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />
          <rect x="14" y="5" width="6" height="7" rx="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.8" />
          <rect x="4" y="17" width="15" height="4" rx="1" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
          {/* Impact star */}
          <path d="M18 4L20 2M21 6L23 5M20 9L22 10" stroke="#FDE047" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  if (type === 'magplant') {
    // Magplant 5000: Dark box with glowing green orb
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900 border border-emerald-500/30 shadow-sm ${dim} ${className}`}>
        <svg viewBox="0 0 24 24" className="w-4/5 h-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Base box */}
          <rect x="5" y="10" width="14" height="11" rx="1" fill="#1E293B" stroke="#10B981" strokeWidth="1.2" />
          {/* Floating green sphere */}
          <circle cx="12" cy="7" r="4.5" fill="#10B981" stroke="#34D399" strokeWidth="1" />
          <path d="M12 3V11M8 7H16" stroke="#A7F3D0" strokeWidth="0.8" />
          <rect x="8" y="13" width="8" height="5" fill="#0F172A" />
          <circle cx="10" cy="15.5" r="0.9" fill="#34D399" />
          <circle cx="12" cy="15.5" r="0.9" fill="#34D399" />
          <circle cx="14" cy="15.5" r="0.9" fill="#34D399" />
        </svg>
      </div>
    );
  }

  if (type === 'ghc') {
    // Golden Heart Crystal
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900 border border-amber-500/30 shadow-sm ${dim} ${className}`}>
        <svg viewBox="0 0 24 24" className="w-4/5 h-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21L4.5 13.5C2.5 11.5 2.5 8 4.5 6C6.5 4 10 4 12 6.5C14 4 17.5 4 19.5 6C21.5 8 21.5 11.5 19.5 13.5L12 21Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
          <path d="M12 6.5V21M4.5 6L12 13.5L19.5 6" stroke="#FDE68A" strokeWidth="0.8" />
          <rect x="8" y="8" width="1.5" height="1.5" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // Fallback / wings / geiger
  return (
    <div className={`relative flex items-center justify-center rounded-lg bg-slate-900 border border-slate-700/60 shadow-sm ${dim} ${className}`}>
      <span className="text-xs font-bold text-slate-300">GT</span>
    </div>
  );
};
