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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#091124] border border-blue-900/60 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden text-center">
        {/* Deep Blue and Cyan ambient background effects */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-blue-600/25 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
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
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-sky-950/40 to-[#060c1c] border border-sky-500/40 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/25 transition-all duration-200 text-center flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-[1.03]"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-400/40 text-sky-400 flex items-center justify-center group-hover:bg-sky-400 group-hover:text-slate-950 transition-all shadow-md shadow-sky-500/10">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div className="text-base sm:text-lg font-extrabold text-white group-hover:text-sky-300 transition-colors">
              Beli BGL / Item
            </div>
          </button>

          {/* Option 2: Jual BGL / Item */}
          <button
            type="button"
            onClick={() => onSelectMode('sell')}
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-[#060c1c] border border-blue-500/40 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-200 text-center flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-[1.03]"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-400/40 text-blue-300 flex items-center justify-center group-hover:bg-blue-400 group-hover:text-slate-950 transition-all shadow-md shadow-blue-500/10">
              <Coins className="w-7 h-7" />
            </div>
            <div className="text-base sm:text-lg font-extrabold text-white group-hover:text-blue-200 transition-colors">
              Jual BGL / Item
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};
