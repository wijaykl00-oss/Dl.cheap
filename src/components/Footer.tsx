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
    <footer id="faq" className="bg-[#030712] border-t border-blue-950 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* FAQ SECTION */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-sky-500/30 text-xs font-semibold text-sky-400 mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pusat Bantuan & Panduan Transaksi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
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
                  className="rounded-2xl border border-blue-900/60 bg-[#081022] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 flex items-center justify-between text-left gap-3 hover:bg-[#0c183a] transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-xs sm:text-sm text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-sky-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-blue-950 pt-3">
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
            href="https://wa.me/6285124935573?text=Halo%20Admin%20dlcheaps,%20mau%20tanya%20transaksi"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-[#081022] border border-blue-900/60 hover:border-sky-400/60 hover:shadow-lg hover:shadow-sky-500/10 transition-all flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1">
                WhatsApp Admin <ExternalLink className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[11px] text-sky-300 mt-0.5 font-medium">0851-2493-5573 (Fast Respon)</div>
            </div>
          </a>

          <div className="p-4 rounded-2xl bg-[#081022] border border-blue-900/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Jam Operasional</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Bot: 24 Jam | Admin: 08.00-24.00</div>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="pt-6 border-t border-blue-950 text-center space-y-2">
          <p className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
            <strong>Disclaimer:</strong> dlcheaps adalah layanan penyedia jasa dan transaksi game independen. Seluruh hak cipta, merek dagang, dan nama <strong>Growtopia</strong> merupakan hak milik resmi dari <strong>Ubisoft Entertainment</strong>. Situs ini tidak terafiliasi atau dikelola secara langsung oleh Ubisoft.
          </p>
          <div className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} dlcheaps. Toko Jual Beli Lock & Item Growtopia.
          </div>
        </div>

      </div>
    </footer>
  );
};
