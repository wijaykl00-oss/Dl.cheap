import React, { useState } from 'react';
import { 
  TransactionMode, 
  ItemCategory, 
  MarketItem, 
  PaymentMethod, 
  Order 
} from '../types';
import { MARKET_ITEMS, PAYMENT_METHODS, USER_PAYOUT_OPTIONS } from '../data/marketData';
import { formatRupiah, formatNumber, generateInvoiceId, generateSecurityPin } from '../utils/formatters';
import { GtItemIcon } from './GtItemIcon';
import { 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  QrCode, 
  Wallet, 
  Building2, 
  CreditCard, 
  Smartphone, 
  Info,
  Clock,
  CheckCircle2,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface HeroTransactionProps {
  selectedItem: MarketItem;
  onSelectItem: (item: MarketItem) => void;
  activeMode: TransactionMode;
  onSwitchMode: (mode: TransactionMode) => void;
  onSubmitOrder: (order: Order) => void;
  userGrowIdPrefill?: string;
}

export const HeroTransaction: React.FC<HeroTransactionProps> = ({
  selectedItem,
  onSelectItem,
  activeMode,
  onSwitchMode,
  onSubmitOrder,
  userGrowIdPrefill = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<ItemCategory>(selectedItem.category);
  const [quantity, setQuantity] = useState<number>(selectedItem.category === 'bgl' ? 1 : 10);
  const [growId, setGrowId] = useState<string>(userGrowIdPrefill || '');
  const [worldName, setWorldName] = useState<string>('');
  const [contactWa, setContactWa] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);

  // Jual (Sell) payout state
  const [payoutProvider, setPayoutProvider] = useState<string>('bca');
  const [payoutAccountNumber, setPayoutAccountNumber] = useState<string>('');
  const [payoutAccountHolder, setPayoutAccountHolder] = useState<string>('');

  // Form error state
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Filter items based on category
  const filteredCategoryItems = MARKET_ITEMS.filter((item) => {
    if (activeCategory === 'bgl') return item.category === 'bgl';
    if (activeCategory === 'dl') return item.category === 'dl';
    return item.category === 'items';
  });

  // Calculate pricing
  const unitPrice = activeMode === 'buy' ? selectedItem.buyPrice : selectedItem.sellPrice;
  const subtotal = quantity * unitPrice;
  
  // Payment fee calculation for buy mode
  const paymentFee = activeMode === 'buy' 
    ? Math.round((subtotal * (selectedPayment.feePercent / 100)) + selectedPayment.feeFixed)
    : 0;
  
  const totalAmount = activeMode === 'buy' ? subtotal + paymentFee : subtotal;

  // Handle Category Click
  const handleCategoryChange = (cat: ItemCategory) => {
    setActiveCategory(cat);
    const firstInCat = MARKET_ITEMS.find((it) => it.category === cat) || MARKET_ITEMS[0];
    onSelectItem(firstInCat);
    setQuantity(cat === 'bgl' ? 1 : (cat === 'dl' ? 10 : 1));
  };

  // Handle Item Card Select
  const handleItemSelect = (item: MarketItem) => {
    onSelectItem(item);
    setActiveCategory(item.category);
    if (item.category === 'bgl') {
      setQuantity(1);
    } else if (item.category === 'dl' && quantity < 5) {
      setQuantity(10);
    } else if (item.category === 'items') {
      setQuantity(1);
    }
  };

  // Quick Preset Adders
  const handleAddQty = (amount: number) => {
    setQuantity((prev) => Math.max(selectedItem.minOrder, Math.min(selectedItem.maxOrder, prev + amount)));
  };

  // Set Direct Preset
  const handleSetPreset = (targetQty: number) => {
    setQuantity(Math.max(selectedItem.minOrder, Math.min(selectedItem.maxOrder, targetQty)));
  };

  // Handle Submit Order
  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!growId.trim()) {
      setErrorMessage('Silakan isi GrowID (Username Growtopia) Anda!');
      return;
    }
    if (!worldName.trim()) {
      setErrorMessage('Silakan isi nama World tujuan transaksi!');
      return;
    }

    if (quantity < selectedItem.minOrder) {
      setErrorMessage(`Jumlah minimal pemesanan adalah ${selectedItem.minOrder} ${selectedItem.unit}`);
      return;
    }

    if (activeMode === 'sell') {
      if (!payoutAccountNumber.trim()) {
        setErrorMessage('Silakan isi nomor rekening atau nomor e-wallet penerima dana!');
        return;
      }
      if (!payoutAccountHolder.trim()) {
        setErrorMessage('Silakan isi nama pemilik rekening (atas nama)!');
        return;
      }
    }

    const newOrder: Order = {
      id: generateInvoiceId(),
      mode: activeMode,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      category: selectedItem.category,
      quantity,
      unitPrice,
      subtotal,
      paymentFee,
      totalAmount,
      growId: growId.trim(),
      worldName: worldName.trim().toUpperCase(),
      contactWa: contactWa.trim() || '081234567890',
      paymentMethod: activeMode === 'buy' ? selectedPayment : undefined,
      userPayout: activeMode === 'sell' ? {
        provider: USER_PAYOUT_OPTIONS.find(p => p.id === payoutProvider)?.name || payoutProvider.toUpperCase(),
        accountNumber: payoutAccountNumber.trim(),
        accountHolder: payoutAccountHolder.trim().toUpperCase(),
      } : undefined,
      dropInstructions: activeMode === 'sell' ? {
        world: 'GROWSTOREBUY',
        botName: 'StoreBot_ID88',
        securityPin: generateSecurityPin(),
        boxNote: `Drop ${quantity} ${selectedItem.unit} ke Donation Box Bot`,
      } : undefined,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
    };

    onSubmitOrder(newOrder);
  };

  const renderPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'QrCode': return <QrCode className="w-4 h-4 text-emerald-400" />;
      case 'Wallet': return <Wallet className="w-4 h-4 text-blue-400" />;
      case 'Building2': return <Building2 className="w-4 h-4 text-purple-400" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4 text-amber-400" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4 text-teal-400" />;
      default: return <CreditCard className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <section id="transaksi" className="pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Store Notice / Important Banner */}
      <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Panduan Pengiriman Bot:</strong> Pastikan di World Anda sudah terpasang <strong>Donation Box</strong> atau <strong>Display Box</strong> agar bot dapat mendrop lock secara otomatis.
          </span>
        </div>
        <a
          href="#faq"
          className="text-emerald-400 hover:text-emerald-300 font-semibold underline shrink-0 text-xs inline-flex items-center gap-1"
        >
          Lihat Petunjuk <ChevronRight className="w-3 h-3" />
        </a>
      </div>

      {/* Main Mode Toggle: Beli vs Jual (Tampung) */}
      <div className="mb-8 flex flex-col items-center">
        <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            id="tab-buy"
            type="button"
            onClick={() => onSwitchMode('buy')}
            className={`flex items-center gap-2 px-6 sm:px-10 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeMode === 'buy'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🛒 Beli Lock & Item</span>
          </button>
          <button
            id="tab-sell"
            type="button"
            onClick={() => onSwitchMode('sell')}
            className={`flex items-center gap-2 px-6 sm:px-10 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeMode === 'sell'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💰 Jual Lock (Tampung Admin)</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          {activeMode === 'buy' 
            ? 'Pilih item, bayar via QRIS/Bank, bot otomatis drop ke world Anda.' 
            : 'Jual sisa lock hasil farm Anda, drop ke world toko, dana cair langsung ke rekening/e-wallet.'}
        </p>
      </div>

      {/* Main Form Grid */}
      <form onSubmit={handleProceed} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ITEM PICKER & ACCOUNT DATA (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* STEP 1: Pilih Item & Nominal */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">1</span>
                <span>Pilih Kategori & Item</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                Rate: <strong className="text-slate-200">{formatRupiah(unitPrice)}</strong> / {selectedItem.unit}
              </span>
            </div>

            {/* Category tabs */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleCategoryChange('dl')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeCategory === 'dl'
                    ? 'bg-slate-800 border-cyan-500 text-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <GtItemIcon type="dl" size="sm" className="w-5 h-5" />
                <span>Diamond Lock (DL)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('bgl')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeCategory === 'bgl'
                    ? 'bg-slate-800 border-blue-500 text-blue-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <GtItemIcon type="bgl" size="sm" className="w-5 h-5" />
                <span>Blue Gem Lock (BGL)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('items')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeCategory === 'items'
                    ? 'bg-slate-800 border-emerald-500 text-emerald-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <GtItemIcon type="rayman" size="sm" className="w-5 h-5" />
                <span>Item Langka GT</span>
              </button>
            </div>

            {/* Item list in category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {filteredCategoryItems.map((item) => {
                const isSelected = selectedItem.id === item.id;
                const currentPrice = activeMode === 'buy' ? item.buyPrice : item.sellPrice;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemSelect(item)}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 text-white'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <GtItemIcon type={item.iconType as any} size="sm" className="w-8 h-8 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm truncate text-slate-200">{item.name}</div>
                        <div className="text-[11px] text-slate-400">
                          Stok: <span className="text-slate-300 font-semibold">{formatNumber(item.stock)}</span> {item.unit}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-xs text-emerald-400">
                        {formatRupiah(currentPrice)}
                      </div>
                      <div className="text-[10px] text-slate-500">per {item.unit}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quantity Selector & Quick Presets */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                <label className="text-xs font-semibold text-slate-300">
                  Jumlah Pesanan ({selectedItem.unit}):
                </label>

                {/* Quick Presets for DL or BGL */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedItem.category === 'dl' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSetPreset(10)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 cursor-pointer"
                      >
                        10 DL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset(25)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 cursor-pointer"
                      >
                        25 DL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset(50)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 cursor-pointer"
                      >
                        50 DL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset(100)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-cyan-300 cursor-pointer"
                      >
                        100 DL (1 BGL)
                      </button>
                    </>
                  ) : selectedItem.category === 'bgl' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSetPreset(1)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 cursor-pointer"
                      >
                        1 BGL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset(2)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 cursor-pointer"
                      >
                        2 BGL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset(5)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 cursor-pointer"
                      >
                        5 BGL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset(10)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-blue-300 cursor-pointer"
                      >
                        10 BGL
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSetPreset(1)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 cursor-pointer"
                      >
                        1 Pcs
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset(2)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 cursor-pointer"
                      >
                        2 Pcs
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Number stepper */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 overflow-hidden w-40">
                  <button
                    type="button"
                    onClick={() => handleAddQty(-1)}
                    className="w-10 py-2 text-slate-300 hover:bg-slate-800 font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={selectedItem.minOrder}
                    max={selectedItem.maxOrder}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(selectedItem.minOrder, parseInt(e.target.value) || selectedItem.minOrder))}
                    className="w-full text-center bg-transparent text-white font-bold text-sm focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddQty(1)}
                    className="w-10 py-2 text-slate-300 hover:bg-slate-800 font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs text-slate-400">
                  Subtotal: <strong className="text-white text-sm">{formatRupiah(subtotal)}</strong>
                </div>
              </div>
            </div>

          </div>

          {/* STEP 2: Data Akun & World */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">2</span>
                <span>Data Akun & World Growtopia</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  GrowID (Username GT) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Reyhan_GT"
                  value={growId}
                  onChange={(e) => setGrowId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-hidden"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Pastikan nama akun sama dengan pemilik world box.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama World Tujuan <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: REYFARM99"
                  value={worldName}
                  onChange={(e) => setWorldName(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm uppercase focus:border-emerald-500 focus:outline-hidden"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Wajib ada Donation Box / Display Box terbuka.
                </span>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nomor WhatsApp (Untuk Notifikasi Resi Pengiriman)
              </label>
              <input
                type="text"
                placeholder="08xxxxxxxxxx"
                value={contactWa}
                onChange={(e) => setContactWa(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* STEP 2B (If SELL Mode): Data Rekening Pencairan */}
          {activeMode === 'sell' && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-amber-500/20 pb-2">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-xs">★</span>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">
                  Data Rekening Pencairan Dana Jual
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Bank / E-Wallet</label>
                  <select
                    value={payoutProvider}
                    onChange={(e) => setPayoutProvider(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-hidden"
                  >
                    {USER_PAYOUT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Rekening / No E-Wallet</label>
                  <input
                    type="text"
                    placeholder="Contoh: 8295018233"
                    value={payoutAccountNumber}
                    onChange={(e) => setPayoutAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Atas Nama (Nama Pemilik)</label>
                  <input
                    type="text"
                    placeholder="Contoh: REYHAN PRATAMA"
                    value={payoutAccountHolder}
                    onChange={(e) => setPayoutAccountHolder(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm uppercase focus:border-amber-400 focus:outline-hidden"
                    required
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: PAYMENT & SUMMARY CHECKOUT (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* STEP 3: Metode Pembayaran (For Buy Mode) */}
          {activeMode === 'buy' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">3</span>
                  <span>Pilih Metode Pembayaran</span>
                </h3>
              </div>

              <div className="space-y-2">
                {PAYMENT_METHODS.map((pay) => {
                  const isSelected = selectedPayment.id === pay.id;
                  return (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setSelectedPayment(pay)}
                      className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-500 text-white'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center border border-slate-800">
                          {renderPaymentIcon(pay.iconName)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                            <span>{pay.name}</span>
                            {pay.badge && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                                {pay.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-slate-400">
                        {pay.feePercent === 0 && pay.feeFixed === 0 ? (
                          <span className="text-emerald-400 font-medium">Bebas Biaya</span>
                        ) : (
                          <span>+{formatRupiah(pay.feeFixed)}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Ringkasan Transaksi & Tombol Final */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2.5">
              Ringkasan Pesanan
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Item Dipesan</span>
                <span className="font-semibold text-slate-200">{selectedItem.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Jumlah</span>
                <span className="font-semibold text-slate-200">{quantity} {selectedItem.unit}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Harga Satuan</span>
                <span className="font-semibold text-slate-200">{formatRupiah(unitPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-200">{formatRupiah(subtotal)}</span>
              </div>

              {activeMode === 'buy' && (
                <div className="flex items-center justify-between text-slate-400">
                  <span>Biaya Layanan ({selectedPayment.name.split(' ')[0]})</span>
                  <span className="font-semibold text-emerald-400">{paymentFee === 0 ? 'Gratis' : formatRupiah(paymentFee)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-200 text-sm">
                  {activeMode === 'buy' ? 'Total Bayar' : 'Total Dana Diterima'}
                </span>
                <span className="font-extrabold text-base sm:text-lg text-emerald-400">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                activeMode === 'buy'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              <span>{activeMode === 'buy' ? 'Beli Sekarang (Lanjut Bayar)' : 'Kirim Pengajuan Jual'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-center gap-1 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Garansi 100% Anti-Rollback & Aman Shadowban</span>
              </div>
              <div>Pengiriman bot otomatis dalam 30 detik s/d 2 menit.</div>
            </div>
          </div>

        </div>

      </form>

    </section>
  );
};
