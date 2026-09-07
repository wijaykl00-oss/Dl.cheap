import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { formatRupiah } from '../utils/formatters';
import { 
  X, 
  Copy, 
  Check, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  QrCode,
  MapPin,
  KeyRound
} from 'lucide-react';

interface OrderModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins countdown
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulateCompletion = () => {
    setIsSimulating(true);

    if (order.mode === 'buy') {
      setSimulationStep('Memverifikasi status pembayaran...');
      setTimeout(() => {
        setSimulationStep('Menghubungi Bot Delivery Toko...');
        setTimeout(() => {
          setSimulationStep(`Bot menuju world ${order.worldName}...`);
          setTimeout(() => {
            setSimulationStep('Item berhasil di-drop di Donation Box!');
            onUpdateStatus(order.id, 'completed');
            setIsSimulating(false);
          }, 1200);
        }, 1200);
      }, 1000);
    } else {
      setSimulationStep('Bot mengecek drop item di world GROWSTOREBUY...');
      setTimeout(() => {
        setSimulationStep(`Item ${order.quantity} ${order.itemName} terkonfirmasi diterima.`);
        setTimeout(() => {
          setSimulationStep(`Mentransfer ${formatRupiah(order.totalAmount)} ke rekening user...`);
          setTimeout(() => {
            setSimulationStep('Dana berhasil ditransfer!');
            onUpdateStatus(order.id, 'completed');
            setIsSimulating(false);
          }, 1200);
        }, 1200);
      }, 1000);
    }
  };

  const isCompleted = order.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
            <span>Invoice: {order.id}</span>
            <button
              onClick={() => handleCopy(order.id, 'invoice')}
              className="hover:text-emerald-400 ml-1 cursor-pointer"
              title="Salin nomor invoice"
            >
              {copiedField === 'invoice' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {isCompleted 
              ? (order.mode === 'buy' ? 'Transaksi Pembelian Berhasil' : 'Pencairan Dana Selesai')
              : (order.mode === 'buy' ? 'Konfirmasi Pembayaran' : 'Instruksi Drop Item ke Bot')}
          </h3>
          <p className="text-xs text-slate-400">
            {isCompleted 
              ? 'Terima kasih telah berbelanja di GrowStore!'
              : (order.mode === 'buy' ? 'Silakan selesaikan pembayaran sebelum batas waktu berakhir' : 'Silakan drop item ke world bot penampung resmi')}
          </p>
        </div>

        {/* COMPLETED SUCCESS VIEW */}
        {isCompleted ? (
          <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Pesanan Selesai!</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {order.mode === 'buy' 
                  ? `Bot telah mendrop ${order.quantity} ${order.itemName} ke World ${order.worldName}.`
                  : `Dana sebesar ${formatRupiah(order.totalAmount)} telah dikirim ke rekening ${order.userPayout?.provider} (${order.userPayout?.accountNumber}).`}
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice:</span>
                <span className="font-mono text-slate-200">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Item:</span>
                <span className="text-slate-200">{order.quantity} {order.itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total:</span>
                <span className="font-bold text-emerald-400">{formatRupiah(order.totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer transition-colors"
            >
              Tutup & Kembali ke Beranda
            </button>
          </div>
        ) : (
          /* ACTIVE TRANSACTION INVOICE DETAILS */
          <div className="space-y-4">
            
            {/* Countdown timer */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Batas Waktu:</span>
              </div>
              <span className="font-mono text-sm font-bold text-amber-400">
                {formatTimer(timeLeft)}
              </span>
            </div>

            {/* MODE BELI */}
            {order.mode === 'buy' && (
              <div className="space-y-3">
                {order.paymentMethod?.category === 'qris' ? (
                  /* QRIS Card */
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2.5">
                    <span className="text-xs font-semibold text-slate-300 block">
                      Scan QRIS Menggunakan E-Wallet / M-Banking Apapun
                    </span>
                    
                    <div className="w-44 h-44 mx-auto bg-white p-2.5 rounded-xl shadow-md flex flex-col items-center justify-center relative">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect x="0" y="0" width="100" height="100" fill="white" />
                        <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                        <rect x="14" y="14" width="17" height="17" fill="white" />
                        <rect x="18" y="18" width="9" height="9" fill="#0f172a" />

                        <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                        <rect x="69" y="14" width="17" height="17" fill="white" />
                        <rect x="73" y="18" width="9" height="9" fill="#0f172a" />

                        <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                        <rect x="14" y="69" width="17" height="17" fill="white" />
                        <rect x="18" y="73" width="9" height="9" fill="#0f172a" />

                        <rect x="42" y="15" width="16" height="6" fill="#0f172a" />
                        <rect x="42" y="27" width="8" height="16" fill="#0f172a" />
                        <rect x="54" y="32" width="10" height="14" fill="#0f172a" />
                        <rect x="15" y="42" width="15" height="8" fill="#0f172a" />
                        <rect x="36" y="48" width="28" height="8" fill="#0f172a" />
                        <rect x="72" y="46" width="14" height="12" fill="#0f172a" />
                        <rect x="44" y="65" width="18" height="18" fill="#0f172a" />
                        <rect x="70" y="70" width="16" height="8" fill="#0f172a" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-bold">
                          QRIS GT
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Merchant: <strong className="text-slate-200">GROWSTORE DIGITAL (ID: 109281)</strong>
                    </div>
                  </div>
                ) : (
                  /* Transfer Bank */
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Metode:</span>
                      <strong className="text-white">{order.paymentMethod?.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Nomor Rekening Tujuan:</span>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-sm font-bold text-emerald-400">
                        <span>{order.paymentMethod?.accountNumber || '8295-0182-3391'}</span>
                        <button
                          onClick={() => handleCopy(order.paymentMethod?.accountNumber || '', 'acc')}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'acc' ? 'Tersalin' : 'Salin'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Atas Nama:</span>
                      <span className="text-slate-200 font-semibold">{order.paymentMethod?.accountHolder}</span>
                    </div>
                  </div>
                )}

                {/* Amount to Pay */}
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Nominal Transfer:</span>
                    <span className="text-base font-bold text-emerald-400">
                      {formatRupiah(order.totalAmount)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(order.totalAmount.toString(), 'amount')}
                    className="p-1.5 rounded bg-slate-900 text-slate-300 hover:text-white text-xs flex items-center gap-1 cursor-pointer border border-slate-700"
                    title="Salin nominal"
                  >
                    {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Salin</span>
                  </button>
                </div>

                {/* Destination Confirmation */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tujuan World:</span>
                    <strong className="text-cyan-400">{order.worldName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GrowID:</span>
                    <strong className="text-white">{order.growId}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* MODE JUAL */}
            {order.mode === 'sell' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <MapPin className="w-4 h-4" />
                    <span>Instruksi Drop Item ke World Bot:</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">Nama World:</span>
                      <strong className="text-emerald-400 font-mono tracking-wider">
                        {order.dropInstructions?.world || 'GROWSTOREBUY'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">Bot Penerima:</span>
                      <strong className="text-cyan-400 font-mono">
                        {order.dropInstructions?.botName || 'StoreBot_ID88'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">Security PIN Door:</span>
                      <strong className="text-amber-400 font-mono">
                        {order.dropInstructions?.securityPin || '9842'}
                      </strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Masuk ke world di atas, dekati bot, dan drop <strong className="text-white">{order.quantity} {order.itemName}</strong>.
                  </p>
                </div>

                {/* Payout destination */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pencairan Ke:</span>
                    <strong className="text-white">{order.userPayout?.provider} ({order.userPayout?.accountNumber})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Atas Nama:</span>
                    <span className="text-slate-200">{order.userPayout?.accountHolder}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Dana Cair:</span>
                    <strong className="text-amber-400 font-bold">{formatRupiah(order.totalAmount)}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* SIMULATION LOADER */}
            {isSimulating && (
              <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/40 text-center space-y-1.5">
                <div className="text-cyan-400 text-xs font-semibold">
                  {simulationStep}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full animate-pulse"></div>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isSimulating}
                onClick={handleSimulateCompletion}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  order.mode === 'buy'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {isSimulating ? (
                  <span>Sedang Memproses Transaksi...</span>
                ) : (
                  <>
                    <span>
                      {order.mode === 'buy' ? 'Konfirmasi Saya Sudah Bayar' : 'Konfirmasi Saya Sudah Drop Item'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/6285124935573?text=No.pemesanan%20:%20${encodeURIComponent(order.id)}%0AGrowid%20:%20${encodeURIComponent(order.growId)}%0ANama%20world%20:%20${encodeURIComponent(order.worldName)}%0Afoto%20bukti%20bayar%20yang%20diupload%20:%20(Telah%20diupload%20di%20web)`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <ExternalLink className="w-3 h-3 text-emerald-400" />
                <span>Kendala Transaksi? Chat WhatsApp Admin</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
