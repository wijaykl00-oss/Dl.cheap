import React, { useState } from 'react';
import { MarketItem, TransactionMode } from '../types';
import { MARKET_ITEMS } from '../data/marketData';
import { formatRupiah, formatNumber } from '../utils/formatters';
import { GtItemIcon } from './GtItemIcon';
import { 
  RefreshCw, 
  Search, 
  Clock, 
  CheckCircle2, 
  ShoppingCart, 
  ArrowDownLeft,
  Info
} from 'lucide-react';

interface RateStockTableProps {
  onSelectAction: (item: MarketItem, mode: TransactionMode) => void;
}

export const RateStockTable: React.FC<RateStockTableProps> = ({ onSelectAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'lock' | 'items'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Update Realtime');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdated(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`);
    }, 500);
  };

  const filteredItems = MARKET_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterCategory === 'lock') return item.category === 'dl' || item.category === 'bgl';
    if (filterCategory === 'items') return item.category === 'items';
    return true;
  });

  return (
    <section id="tabel-rate" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Table Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            Papan Informasi Pasar Growtopia
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Daftar Rate Harga & Ketersediaan Stok
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Harga beli dan tampung admin terupdate otomatis sesuai pergerakan pasar.
          </p>
        </div>

        {/* Refresh & Last update badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <div className="text-slate-400 flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{lastUpdated}</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
            title="Cek pembaruan harga"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Perbarui</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua Produk
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('lock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterCategory === 'lock'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Mata Uang (Lock)
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('items')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterCategory === 'items'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Item
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari item atau simbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Desktop Responsive Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Nama Item</th>
              <th className="py-3 px-4">Harga Beli Anda</th>
              <th className="py-3 px-4">Rate Tampung (Anda Jual)</th>
              <th className="py-3 px-4">Status Stok</th>
              <th className="py-3 px-4 text-right">Aksi Cepat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                
                {/* Item Info */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <GtItemIcon type={item.iconType as any} size="sm" className="w-8 h-8 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-xs sm:max-w-md">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Buy Price */}
                <td className="py-3 px-4">
                  <div className="font-bold text-emerald-400 text-sm">
                    {formatRupiah(item.buyPrice)}
                  </div>
                  <div className="text-[10px] text-slate-500">per {item.unit}</div>
                </td>

                {/* Sell / Tampung Price */}
                <td className="py-3 px-4">
                  <div className="font-bold text-amber-400 text-sm">
                    {formatRupiah(item.sellPrice)}
                  </div>
                  <div className="text-[10px] text-slate-500">cair ke rekening</div>
                </td>

                {/* Stock info */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-semibold text-slate-200">
                      {formatNumber(item.stock)} {item.unit}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400/80 mt-0.5 font-medium">
                    Siap Kirim Otomatis
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectAction(item, 'buy')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>Beli</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectAction(item, 'sell')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <ArrowDownLeft className="w-3 h-3 text-amber-400" />
                      <span>Jual</span>
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-right text-[11px] text-slate-500">
        Klik tombol "Beli" atau "Jual" pada tabel di atas untuk langsung mengisi formulir transaksi secara otomatis.
      </div>
    </section>
  );
};
