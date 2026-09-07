import React from 'react';
import { ShoppingCart, Coins, ShieldCheck, Sparkles, X } from 'lucide-react';
import { TransactionMode } from '../types';
import { GtItemIcon } from './GtItemIcon';

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
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-center">
        {/* Glow ambient background effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo / Header */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <GtItemIcon type="bgl" size="sm" className="w-10 h-10" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Grow<span className="text-emerald-400">Store</span>
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-300 font-medium mb-1">
          Selamat datang! Silakan pilih transaksi Anda:
        </p>
        <p className="text-xs text-slate-400 mb-6">
          Pengiriman bot otomatis 24 jam langsung ke Donation/Display Box World Anda.
        </p>

        {/* 2 Big Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Option 1: Beli BGL / Item */}
          <button
            type="button"
            onClick={() => onSelectMode('buy')}
            className="group relative p-5 rounded-xl bg-gradient-to-b from-emerald-950/60 to-slate-900 border border-emerald-500/50 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 text-left flex flex-col justify-between cursor-pointer hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                <span>Beli BGL / Item</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                Beli DL, BGL & item langka GT dengan pembayaran QRIS / E-Wallet / Jago.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-900/50 text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
              <span>Mulai Beli &rarr;</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px]">Stok Ready</span>
            </div>
          </button>

          {/* Option 2: Jual BGL / Item */}
          <button
            type="button"
            onClick={() => onSelectMode('sell')}
            className="group relative p-5 rounded-xl bg-gradient-to-b from-amber-950/60 to-slate-900 border border-amber-500/50 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200 text-left flex flex-col justify-between cursor-pointer hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span>Jual BGL / Item</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                Tampung DL / BGL hasil farm Anda. Dana langsung cair ke Rekening / E-Wallet.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-900/50 text-[11px] font-semibold text-amber-400 flex items-center justify-between">
              <span>Mulai Jual &rarr;</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[10px]">Pencairan Cepat</span>
            </div>
          </button>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Transaksi Cepat, Aman & Terpercaya</span>
        </div>
      </div>
    </div>
  );
};
