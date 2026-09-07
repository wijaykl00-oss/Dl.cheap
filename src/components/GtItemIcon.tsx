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
    // Magplant 5000
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900/80 border border-emerald-500/30 shadow-sm overflow-hidden p-0.5 ${dim} ${className}`}>
        <img
          src="/foto/magplant.png"
          alt="Magplant 5000"
          className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]"
          loading="lazy"
        />
      </div>
    );
  }

  if (type === 'ghc') {
    // Golden Heart Crystal
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900/80 border border-amber-500/30 shadow-sm overflow-hidden p-0.5 ${dim} ${className}`}>
        <img
          src="/foto/ghc.png"
          alt="Golden Heart Crystal"
          className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.35)]"
          loading="lazy"
        />
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
