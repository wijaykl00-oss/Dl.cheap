import React, { useState } from 'react';
import { Order } from '../types';
import { formatRupiah } from '../utils/formatters';
import { Search, X, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface OrderTrackerModalProps {
  orders: Order[];
  onClose: () => void;
  onOpenOrder: (order: Order) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  orders,
  onClose,
  onOpenOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const matchedOrders = orders.filter((o) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return false;
    return (
      o.id.toLowerCase().includes(term) ||
      o.growId.toLowerCase().includes(term) ||
      o.worldName.toLowerCase().includes(term)
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#081022] border border-blue-900/60 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white bg-[#0f1d44] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h3 className="text-lg font-bold text-white">
            Lacak Status Pesanan
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Masukkan Invoice ID (misal: INV-GT-xxxx) atau GrowID Anda.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID Invoice atau GrowID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#040814] border border-blue-900/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-hidden focus:border-sky-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 text-xs font-bold hover:bg-sky-400 transition-colors cursor-pointer"
          >
            Cari
          </button>
        </form>

        {/* Results */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {hasSearched && matchedOrders.length === 0 ? (
            <div className="p-4 rounded-2xl bg-[#040814] border border-blue-950 text-center space-y-1 text-xs">
              <AlertCircle className="w-5 h-5 text-sky-400 mx-auto" />
              <p className="font-semibold text-white">Pesanan Tidak Ditemukan</p>
              <p className="text-slate-400 text-[11px]">
                Pastikan format nomor invoice atau GrowID sudah sesuai.
              </p>
            </div>
          ) : (
            (hasSearched ? matchedOrders : orders.slice(0, 4)).map((order) => (
              <div
                key={order.id}
                onClick={() => onOpenOrder(order)}
                className="p-3.5 rounded-2xl bg-[#040814] border border-blue-950 hover:border-sky-500/60 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-400">{order.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      order.status === 'completed'
                        ? 'bg-sky-950 text-sky-300 border border-sky-500/30'
                        : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                    }`}>
                      {order.status === 'completed' ? 'Selesai' : 'Menunggu Bayar'}
                    </span>
                  </div>
                  <div className="text-white font-medium">
                    {order.quantity} {order.itemName} ({formatRupiah(order.totalAmount)})
                  </div>
                  <div className="text-[11px] text-slate-400">
                    World: <span className="text-sky-300">{order.worldName}</span> • GrowID: <span className="text-slate-300">{order.growId}</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 transition-colors" />
              </div>
            ))
          )}
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-500">
          Pesanan tersimpan otomatis di perangkat ini selama sesi aktif.
        </div>

      </div>
    </div>
  );
};
