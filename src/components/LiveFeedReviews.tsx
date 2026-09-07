import React, { useState } from 'react';
import { LiveFeedItem, ReviewItem } from '../types';
import { INITIAL_LIVE_FEED, CUSTOMER_REVIEWS } from '../data/marketData';
import { 
  CheckCircle, 
  Star, 
  ShieldCheck, 
  Zap, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Lock,
  Headphones
} from 'lucide-react';

export const LiveFeedReviews: React.FC = () => {
  const [liveFeeds] = useState<LiveFeedItem[]>(INITIAL_LIVE_FEED);
  const [activeFeedTab, setActiveFeedTab] = useState<'all' | 'buy' | 'sell'>('all');

  const filteredFeeds = liveFeeds.filter((feed) => {
    if (activeFeedTab === 'buy') return feed.type === 'buy';
    if (activeFeedTab === 'sell') return feed.type === 'sell';
    return true;
  });

  return (
    <section id="testimoni" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800">
      
      {/* 3 Practical Store Guarantees (Instead of generic AI metric cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">100% Legal & Bebas Rollback</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Lock bersumber murni dari farming aktif dan trade bersih. Tidak menggunakan metode carding atau phising ilegal.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Bot Delivery Otomatis 24 Jam</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Pesanan diantar langsung oleh sistem bot ke Donation/Display Box world Anda secara instan dalam 1-3 menit.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Bantuan WhatsApp Fast Respon</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Jika salah ketik nama world atau server GT sedang antre, CS admin manusia siap membantu perbaikan order.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Recent Transactions Feed (Left 5 cols) & Customer Feedback (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LOG TRANSAKSI TERBARU (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 className="font-bold text-slate-200 text-xs sm:text-sm uppercase tracking-wider">
                Log Transaksi Terakhir
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Live Bot Log</span>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveFeedTab('all')}
              className={`flex-1 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeFeedTab === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setActiveFeedTab('buy')}
              className={`flex-1 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeFeedTab === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Beli
            </button>
            <button
              type="button"
              onClick={() => setActiveFeedTab('sell')}
              className={`flex-1 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeFeedTab === 'sell' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Jual
            </button>
          </div>

          {/* Transaction items */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredFeeds.map((feed) => (
              <div
                key={feed.id}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-md ${feed.type === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {feed.type === 'buy' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-200">{feed.growIdMasked}</span>
                      <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                        feed.type === 'buy' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {feed.type === 'buy' ? 'Beli' : 'Jual'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {feed.quantity} • <span className="text-slate-300">{feed.method}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-semibold text-slate-200 block">{feed.totalIdr}</span>
                  <span className="text-[10px] text-slate-500">{feed.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-1 text-[11px] text-slate-500">
            Nama GrowID disamarkan sebagian untuk menjaga privasi akun pelanggan.
          </div>
        </div>

        {/* TESTIMONI PELANGGAN (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-slate-200 text-xs sm:text-sm uppercase tracking-wider">
                Ulasan & Testimoni Pelanggan
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Komunitas Growtopia ID</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-2.5 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {rev.itemTraded}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed italic text-[11px] sm:text-xs">
                    "{rev.review}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-200">{rev.name}</span>
                    <span className="text-slate-500 font-mono">({rev.growId})</span>
                  </div>
                  <span className="text-slate-500">{rev.date.split(',')[0]}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between gap-3">
            <span>Mau kirim testimoni setelah order selesai? Hubungi admin di WhatsApp.</span>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20GrowStore,%20mau%20kirim%20testimoni"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline font-semibold shrink-0"
            >
              Kirim Testi &rarr;
            </a>
          </div>
        </div>

      </div>

    </section>
  );
};
