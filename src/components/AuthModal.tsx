import React, { useState } from 'react';
import { X, User, Lock, Phone } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: { growId: string; name: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [growId, setGrowId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!growId.trim()) return;

    const userData = {
      growId: growId.trim(),
      name: name.trim() || growId.trim(),
    };

    onLoginSuccess(userData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-1">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            {isRegister ? 'Daftar Akun Member' : 'Masuk ke Akun GrowStore'}
          </h3>
          <p className="text-xs text-slate-400">
            {isRegister 
              ? 'Daftar agar GrowID & data world tersimpan otomatis saat transaksi.' 
              : 'Gunakan GrowID Anda untuk mempermudah transaksi.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              !isRegister ? 'bg-slate-800 text-emerald-400 shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              isRegister ? 'bg-slate-800 text-emerald-400 shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isRegister && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                placeholder="Contoh: Reyhan Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">GrowID Game Anda</label>
            <input
              type="text"
              required
              placeholder="Contoh: Reyhan_GT"
              value={growId}
              onChange={(e) => setGrowId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Nomor WhatsApp (Opsional)</label>
              <input
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer mt-2"
          >
            {isRegister ? 'Daftar Sekarang' : 'Masuk Akun'}
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-500">
          Data akun hanya digunakan untuk keperluan riwayat order transaksi di situs ini.
        </p>

      </div>
    </div>
  );
};
