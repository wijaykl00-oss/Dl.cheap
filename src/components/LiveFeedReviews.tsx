import React, { useState, useEffect } from 'react';
import { LiveFeedItem } from '../types';
import { CUSTOMER_REVIEWS } from '../data/marketData';
import { generateDynamicLogs } from '../utils/logGenerator';
import { 
  Star, 
  Zap, 
  MessageSquare, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Headphones
} from 'lucide-react';

export const LiveFeedReviews: React.FC = () => {
  // Current 30-minute block index (Date.now() divided by 30 minutes in ms)
  const getCurrentTimeBlock = () => Math.floor(Date.now() / (30 * 60 * 1000));
  
  const [timeBlock, setTimeBlock] = useState<number>(getCurrentTimeBlock());
  const [liveFeeds, setLiveFeeds] = useState<LiveFeedItem[]>(() => generateDynamicLogs(getCurrentTimeBlock()));
  const [activeFeedTab, setActiveFeedTab] = useState<'all' | 'buy' | 'sell'>('all');

  // Automatically update logs whenever a new 30-minute interval is reached
  useEffect(() => {
    const interval = setInterval(() => {
      const currentBlock = getCurrentTimeBlock();
      setTimeBlock((prevBlock) => {
        if (currentBlock !== prevBlock) {
          setLiveFeeds(generateDynamicLogs(currentBlock));
          return currentBlock;
        }
        return prevBlock;
      });
    }, 10000); // check every 10 seconds for new 30-min window

    return () => clearInterval(interval);
  }, []);

  const filteredFeeds = liveFeeds.filter((feed) => {
    if (activeFeedTab === 'buy') return feed.type === 'buy';
    if (activeFeedTab === 'sell') return feed.type === 'sell';
    return true;
  });

  return (
    <section id="testimoni" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-blue-950/80">
      
      {/* 2 Practical Store Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="p-4 rounded-2xl bg-[#081022] border border-blue-900/60 flex items-start gap-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0 text-sky-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Bot Delivery Otomatis 24 Jam</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Pesanan diantar langsung oleh sistem bot ke Donation/Display Box world Anda secara instan dalam 1-3 menit.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#081022] border border-blue-900/60 flex items-start gap-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Bantuan WhatsApp Fast Respon</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Jika salah ketik nama world atau butuh konfirmasi, admin WhatsApp siap membantu proses pengiriman order.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Recent Transactions Feed (Left 5 cols) & Customer Feedback (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LOG TRANSAKSI TERBARU (5 cols) */}
        <div className="lg:col-span-5 bg-[#081022] border border-blue-900/60 rounded-3xl p-4 sm:p-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-blue-950/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <h3 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider">
                Log Transaksi Terakhir
              </h3>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#040814] border border-blue-900/80 text-xs">
            <button
              type="button"
              onClick={() => setActiveFeedTab('all')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeFeedTab === 'all' ? 'bg-[#0f1d44] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setActiveFeedTab('buy')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeFeedTab === 'buy' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Beli
            </button>
            <button
              type="button"
              onClick={() => setActiveFeedTab('sell')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeFeedTab === 'sell' ? 'bg-blue-600/30 text-blue-300' : 'text-slate-400 hover:text-slate-200'
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
                className="p-3 rounded-2xl bg-[#040814] border border-blue-950 hover:border-blue-900/80 flex items-center justify-between gap-3 text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${feed.type === 'buy' ? 'bg-sky-500/15 text-sky-400' : 'bg-blue-500/15 text-blue-400'}`}>
                    {feed.type === 'buy' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{feed.growIdMasked}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        feed.type === 'buy' ? 'bg-sky-950 text-sky-300 border border-sky-500/30' : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                      }`}>
                        {feed.type === 'buy' ? 'Beli' : 'Jual'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {feed.quantity} • <span className="text-slate-200">{feed.method}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-extrabold text-sky-400 block">{feed.totalIdr}</span>
                  <span className="text-[10px] text-slate-400">{feed.timeAgo}</span>
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
          <div className="flex items-center justify-between border-b border-blue-950 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider">
                Ulasan & Testimoni Pelanggan
              </h3>
            </div>
            <span className="text-[11px] text-sky-400 font-medium">Komunitas Growtopia ID</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-[#081022] border border-blue-900/60 flex flex-col justify-between space-y-2.5 text-xs shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                      ))}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#040814] text-sky-300 border border-blue-900/70 font-semibold">
                      {rev.itemTraded}
                    </span>
                  </div>

                  <p className="text-slate-200 leading-relaxed italic text-[11px] sm:text-xs">
                    "{rev.review}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-blue-950/80 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">{rev.name}</span>
                    <span className="text-sky-400/80 font-mono">({rev.growId})</span>
                  </div>
                  <span className="text-slate-400">{rev.date.split(',')[0]}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#081022] border border-blue-900/60 text-xs text-slate-300 flex items-center justify-between gap-3 shadow-md">
            <span>Mau kirim testimoni setelah order selesai? Hubungi admin di WhatsApp.</span>
            <a
              href="https://wa.me/6285124935573?text=Halo%20Admin%20dlcheaps,%20mau%20kirim%20testimoni"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:text-sky-300 hover:underline font-bold shrink-0"
            >
              Kirim Testi &rarr;
            </a>
          </div>
        </div>

      </div>

    </section>
  );
};
