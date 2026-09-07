import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  MessageCircle
} from 'lucide-react';
import { GtItemIcon } from './GtItemIcon';

interface HeaderProps {
  onOpenTracker: () => void;
  onScrollToFaq: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTracker,
  onScrollToFaq,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-950/80 bg-[#030712]/95 backdrop-blur-md">
      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <GtItemIcon type="bgl" size="sm" className="w-9 h-9 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white lowercase">
                dl<span className="text-sky-400">cheaps</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-950 text-sky-400 border border-sky-500/30">
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
          <a href="#transaksi" className="hover:text-sky-400 transition-colors">
            Order Lock
          </a>
          <a href="#testimoni" className="hover:text-sky-400 transition-colors">
            Testimoni & Log
          </a>
          <button 
            onClick={onScrollToFaq}
            className="hover:text-sky-400 transition-colors cursor-pointer"
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-[#0b1329] border border-blue-900/60 text-slate-200 hover:border-sky-500/60 hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-sky-500/10"
            title="Lacak status invoice transaksi Anda"
          >
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span>Cek Pesanan</span>
          </button>

          {/* WA Support Button */}
          <a
            href="https://wa.me/6285124935573?text=Halo%20Admin%20dlcheaps,%20mau%20tanya%20transaksi%20Growtopia"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-950/80 border border-sky-500/40 text-sky-300 hover:bg-sky-900/40 hover:text-white transition-all cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>WA Admin</span>
          </a>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#0b1329] text-slate-400 hover:text-white border border-blue-900/60"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-blue-950 bg-[#030712] px-4 py-4 space-y-3 text-sm">
          <a
            href="#transaksi"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-sky-400 border-b border-slate-900"
          >
            Beli & Jual Lock
          </a>
          <a
            href="#testimoni"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-sky-400 border-b border-slate-900"
          >
            Testimoni & Log Transaksi
          </a>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onScrollToFaq();
            }}
            className="block w-full text-left py-2 text-slate-200 hover:text-sky-400 border-b border-slate-900 cursor-pointer"
          >
            Pusat Bantuan & FAQ
          </button>
          <a
            href="https://wa.me/6285124935573?text=Halo%20Admin%20dlcheaps,%20mau%20tanya%20transaksi"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 font-bold text-xs text-slate-950"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp Admin</span>
          </a>
        </div>
      )}
    </header>
  );
};
