import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  MessageCircle,
  HelpCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { GtItemIcon } from './GtItemIcon';

interface HeaderProps {
  onOpenTracker: () => void;
  onOpenAuth: () => void;
  currentUser: { growId: string; name: string } | null;
  onLogout: () => void;
  onScrollToRates: () => void;
  onScrollToFaq: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTracker,
  onOpenAuth,
  currentUser,
  onLogout,
  onScrollToRates,
  onScrollToFaq,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      {/* Top Banner Status Bar (Clean & Real Informative) */}
      <div className="border-b border-slate-800/80 bg-slate-900/90 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-slate-300">
          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-slate-300">Server GT: <span className="text-emerald-400 font-semibold">Online</span></span>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <span>Bot Delivery: <strong className="text-slate-200">24 Jam Non-Stop</strong></span>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="hidden md:flex items-center gap-1 text-slate-400">
              <span>CS WhatsApp: <strong className="text-emerald-400">08.00 - 24.00 WIB</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-amber-300/90">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Waspada Penipuan: Admin tidak pernah minta password GrowID!</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <GtItemIcon type="dl" size="sm" className="w-9 h-9" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Grow<span className="text-emerald-400">Store</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                ID
              </span>
            </div>
            <span className="text-[10px] text-slate-400 -mt-0.5 hidden sm:inline">
              Jual Beli Lock & Item Growtopia
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#transaksi" className="hover:text-emerald-400 transition-colors">
            Order Lock
          </a>
          <button 
            onClick={onScrollToRates}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Daftar Rate Hari Ini
          </button>
          <a href="#testimoni" className="hover:text-slate-100 transition-colors">
            Testimoni & Log
          </a>
          <button 
            onClick={onScrollToFaq}
            className="hover:text-slate-100 transition-colors cursor-pointer"
          >
            Bantuan / FAQ
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Order Tracker Button */}
          <button
            id="btn-track-order"
            onClick={onOpenTracker}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white transition-all cursor-pointer"
            title="Lacak status invoice transaksi Anda"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cek Pesanan</span>
          </button>

          {/* WA Support Button */}
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20GrowStore,%20mau%20tanya%20transaksi%20Growtopia"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-all cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WA Admin</span>
          </a>

          {/* Auth Button / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
              <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {currentUser.growId.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-slate-200 hidden sm:inline">{currentUser.growId}</span>
              <button
                onClick={onLogout}
                className="text-[11px] text-slate-400 hover:text-rose-400 ml-1 transition-colors cursor-pointer"
                title="Keluar akun"
              >
                Keluar
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Masuk</span>
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3 text-sm">
          <a
            href="#transaksi"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-emerald-400 border-b border-slate-900"
          >
            Beli & Jual Lock
          </a>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onScrollToRates();
            }}
            className="block w-full text-left py-2 text-slate-200 hover:text-emerald-400 border-b border-slate-900 cursor-pointer"
          >
            Daftar Rate & Stok
          </button>
          <a
            href="#testimoni"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-emerald-400 border-b border-slate-900"
          >
            Testimoni & Log Transaksi
          </a>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onScrollToFaq();
            }}
            className="block w-full text-left py-2 text-slate-200 hover:text-emerald-400 border-b border-slate-900 cursor-pointer"
          >
            Pusat Bantuan & FAQ
          </button>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20GrowStore,%20mau%20tanya%20transaksi"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-600 font-bold text-xs text-white"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp Admin</span>
          </a>
        </div>
      )}
    </header>
  );
};
