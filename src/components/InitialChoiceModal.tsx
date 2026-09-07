import React from 'react';
import { ShoppingCart, Coins, X } from 'lucide-react';
import { TransactionMode } from '../types';

interface InitialChoiceModalProps {
  isOpen: boolean;
  onSelectMode: (mode: TransactionMode) => void;
  onClose: () => void;
}

export const InitialChoiceModal: React.FC<InitialChoiceModalProps> = ({
  isOpen,
  onSelectMode,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden text-center">
        {/* Glow ambient background effects */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 2 Main Choice Buttons Only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {/* Option 1: Beli BGL / Item */}
          <button
            type="button"
            onClick={() => onSelectMode('buy')}
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-emerald-950/50 to-slate-900 border border-emerald-500/50 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-200 text-center flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-[1.03]"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div className="text-base sm:text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors">
              Beli BGL / Item
            </div>
          </button>

          {/* Option 2: Jual BGL / Item */}
          <button
            type="button"
            onClick={() => onSelectMode('sell')}
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-amber-950/50 to-slate-900 border border-amber-500/50 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-200 text-center flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-[1.03]"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              <Coins className="w-7 h-7" />
            </div>
            <div className="text-base sm:text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">
              Jual BGL / Item
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};
