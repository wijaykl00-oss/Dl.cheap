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

  // Real image sprites from foto/
  if (type === 'dl') {
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900/80 border border-cyan-500/30 shadow-sm overflow-hidden p-0.5 ${dim} ${className}`}>
        <img
          src="/foto/dls.png"
          alt="Diamond Lock"
          className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.35)]"
          loading="lazy"
        />
      </div>
    );
  }

  if (type === 'bgl') {
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900/80 border border-blue-500/30 shadow-sm overflow-hidden p-0.5 ${dim} ${className}`}>
        <img
          src="/foto/bgls.png"
          alt="Blue Gem Lock"
          className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]"
          loading="lazy"
        />
      </div>
    );
  }

  if (type === 'wl') {
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900/80 border border-amber-500/30 shadow-sm overflow-hidden p-0.5 ${dim} ${className}`}>
        <img
          src="/foto/wls.png"
          alt="World Lock"
          className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.35)]"
          loading="lazy"
        />
      </div>
    );
  }

  if (type === 'rayman') {
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900/80 border border-yellow-500/30 shadow-sm overflow-hidden p-0.5 ${dim} ${className}`}>
        <img
          src="/foto/rayman.png"
          alt="Rayman's Fist"
          className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(234,179,8,0.35)]"
          loading="lazy"
        />
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
