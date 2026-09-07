import React, { useState } from 'react';
import { FAQS } from '../data/marketData';
import { 
  ChevronDown, 
  MessageCircle, 
  HelpCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { GtItemIcon } from './GtItemIcon';

export const Footer: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <footer id="faq" className="bg-slate-950 border-t border-slate-800 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* FAQ SECTION */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pusat Bantuan & Panduan Transaksi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Panduan seputar alur pembelian, penampungan lock, dan keamanan akun.
            </p>
          </div>

          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left gap-3 hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-slate-200">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-2.5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CHANNELS & CONTACTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          <a
            href="https://wa.me/6285124935573?text=Halo%20Admin%20GrowStore,%20mau%20tanya%20transaksi"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1">
                WhatsApp Admin <ExternalLink className="w-3 h-3 text-slate-500" />
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">0851-2493-5573 (Fast Respon)</div>
            </div>
          </a>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Jam Operasional</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Bot: 24 Jam | Admin: 08.00-24.00</div>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="pt-6 border-t border-slate-800/80 text-center space-y-2">
          <p className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
            <strong>Disclaimer:</strong> GrowStore adalah layanan penyedia jasa dan transaksi game independen. Seluruh hak cipta, merek dagang, dan nama <strong>Growtopia</strong> merupakan hak milik resmi dari <strong>Ubisoft Entertainment</strong>. Situs ini tidak terafiliasi atau dikelola secara langsung oleh Ubisoft.
          </p>
          <div className="text-[11px] text-slate-600">
            &copy; {new Date().getFullYear()} GrowStore Indonesia. Toko Jual Beli Lock & Item Growtopia.
          </div>
        </div>

      </div>
    </footer>
  );
};
