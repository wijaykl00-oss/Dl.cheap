import React, { useState, useRef } from 'react';
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
  Smartphone, 
  Info,
  CheckCircle2,
  ChevronRight,
  Upload,
  Copy,
  Check,
  Image as ImageIcon,
  Trash2,
  MessageCircle,
  ExternalLink,
  RefreshCw,
  Clock
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
  const [quantity, setQuantity] = useState<number>(selectedItem.category === 'bgl' ? 1 : (selectedItem.category === 'dl' ? 10 : 1));
  const [worldName, setWorldName] = useState<string>('');
  const [growId, setGrowId] = useState<string>(userGrowIdPrefill || '');
  const [contactWa, setContactWa] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);

  // Jual (Sell) payout state
  const [payoutProvider, setPayoutProvider] = useState<string>('bca');
  const [payoutAccountNumber, setPayoutAccountNumber] = useState<string>('');
  const [payoutAccountHolder, setPayoutAccountHolder] = useState<string>('');

  // Step state: 'form' | 'payment_proof'
  const [currentStep, setCurrentStep] = useState<'form' | 'payment_proof'>('form');
  const [activeCreatedOrder, setActiveCreatedOrder] = useState<Order | null>(null);

  // File upload state for proof of payment
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter items based on category
  const filteredCategoryItems = MARKET_ITEMS.filter((item) => {
    if (activeCategory === 'bgl') return item.category === 'bgl';
    if (activeCategory === 'dl') return item.category === 'dl';
    return item.category === 'items';
  });

  // Calculate pricing
  const unitPrice = activeMode === 'buy' ? selectedItem.buyPrice : selectedItem.sellPrice;
  const subtotal = quantity * unitPrice;
  const paymentFee = 0; // All options free fee
  const totalAmount = subtotal;

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

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProof = () => {
    setProofFile(null);
    setProofPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle Form Submit to Step 2 (Payment & Proof Upload)
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!worldName.trim()) {
      setErrorMessage('Silakan isi Nama World tujuan pengiriman!');
      return;
    }
    if (!growId.trim()) {
      setErrorMessage('Silakan isi GrowID (Username Growtopia) Anda!');
      return;
    }
    if (!contactWa.trim()) {
      setErrorMessage('Silakan isi Nomor WhatsApp Anda!');
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

    const orderId = generateInvoiceId();
    const newOrder: Order = {
      id: orderId,
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
      contactWa: contactWa.trim(),
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

    setActiveCreatedOrder(newOrder);
    onSubmitOrder(newOrder);
    setCurrentStep('payment_proof');

    // Smooth scroll to top of section
    const elem = document.getElementById('transaksi');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Build WhatsApp Link with format:
  // No.pemesanan :
  // Growid :
  // Nama world :
  // foto bukti bayar yang diupload :
  const getWhatsAppDirectLink = (order: Order, hasProof: boolean) => {
    const waNumber = '6285124935573';
    
    let message = `No.pemesanan : ${order.id}\n`;
    message += `Growid : ${order.growId}\n`;
    message += `Nama world : ${order.worldName}\n`;
    message += `Item : ${order.itemName} (${order.quantity} ${selectedItem.unit})\n`;
    message += `Total Bayar : ${formatRupiah(order.totalAmount)}\n`;
    message += `Metode Pembayaran : ${order.paymentMethod ? order.paymentMethod.name : 'Pencairan Jual'}\n`;
    message += `foto bukti bayar yang diupload : ${hasProof ? 'Sudah diupload di web (foto bukti pembayaran siap diverifikasi admin)' : 'Bukti bayar terlampir di chat ini'}`;

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleFinishAndRedirectWa = () => {
    if (!activeCreatedOrder) return;
    
    if (activeMode === 'buy' && !proofFile) {
      setErrorMessage('Silakan upload foto bukti pembayaran terlebih dahulu sebelum melanjutkan ke WhatsApp!');
      return;
    }

    const waLink = getWhatsAppDirectLink(activeCreatedOrder, !!proofFile);
    window.open(waLink, '_blank');
  };

  const renderPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'QrCode': return <QrCode className="w-5 h-5 text-emerald-400" />;
      case 'Wallet': return <Wallet className="w-5 h-5 text-blue-400" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-teal-400" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-amber-400" />;
      default: return <Wallet className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <section id="transaksi" className="pt-4 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Mode Toggle: Beli vs Jual */}
      <div className="mb-6 flex flex-col items-center">
        <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
          <button
            id="tab-buy"
            type="button"
            onClick={() => {
              onSwitchMode('buy');
              setCurrentStep('form');
            }}
            className={`flex items-center gap-2 px-6 sm:px-10 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeMode === 'buy'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🛒 Beli BGL / Item</span>
          </button>
          <button
            id="tab-sell"
            type="button"
            onClick={() => {
              onSwitchMode('sell');
              setCurrentStep('form');
            }}
            className={`flex items-center gap-2 px-6 sm:px-10 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeMode === 'sell'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💰 Jual BGL / Item (Tampung)</span>
          </button>
        </div>
      </div>

      {currentStep === 'form' ? (
        /* STEP 1: FORM PEMILIHAN & INPUT DATA */
        <form onSubmit={handleProceedToPayment} className="space-y-6">
          
          {/* 1 PILIH KATEGORI & ITEM (Matching screenshot layout) */}
          <div className="bg-[#0b1120] border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">
                  1
                </span>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                  PILIH KATEGORI & ITEM
                </h3>
              </div>
              <div className="text-xs text-slate-400">
                Rate: <strong className="text-slate-100">{formatRupiah(unitPrice)}</strong> / {selectedItem.unit}
              </div>
            </div>

            {/* Category Tabs: Diamond Lock, Blue Gem Lock, Item Langka GT */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => handleCategoryChange('dl')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeCategory === 'dl'
                    ? 'bg-slate-900 border-cyan-500 text-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-[#080d19] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <GtItemIcon type="dl" size="sm" className="w-5 h-5" />
                <span>Diamond Lock (DL)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('bgl')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeCategory === 'bgl'
                    ? 'bg-slate-900 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10'
                    : 'bg-[#080d19] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <GtItemIcon type="bgl" size="sm" className="w-5 h-5" />
                <span>Blue Gem Lock (BGL)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('items')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeCategory === 'items'
                    ? 'bg-slate-900 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-[#080d19] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <GtItemIcon type="rayman" size="sm" className="w-5 h-5" />
                <span>Item Langka GT</span>
              </button>
            </div>

            {/* Items Grid (Matching Screenshot layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {filteredCategoryItems.map((item) => {
                const isSelected = selectedItem.id === item.id;
                const currentPrice = activeMode === 'buy' ? item.buyPrice : item.sellPrice;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemSelect(item)}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                        : 'bg-[#070c18] border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <GtItemIcon type={item.iconType as any} size="sm" className="w-9 h-9 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-slate-100 truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Stok: <span className="text-slate-300 font-semibold">{formatNumber(item.stock)}</span> {item.unit}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-xs sm:text-sm text-emerald-400">
                        {formatRupiah(currentPrice)}
                      </div>
                      <div className="text-[10px] text-slate-500">per {item.unit}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quantity Selector & Presets */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Jumlah Pesanan ({selectedItem.unit}):
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 overflow-hidden w-36">
                    <button
                      type="button"
                      onClick={() => handleAddQty(-1)}
                      className="w-10 py-2.5 text-slate-300 hover:bg-slate-800 font-bold text-sm cursor-pointer"
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
                      className="w-10 py-2.5 text-slate-300 hover:bg-slate-800 font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Direct Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedItem.category === 'dl' && (
                      <>
                        <button type="button" onClick={() => handleSetPreset(10)} className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer">10 DL</button>
                        <button type="button" onClick={() => handleSetPreset(25)} className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer">25 DL</button>
                        <button type="button" onClick={() => handleSetPreset(50)} className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer">50 DL</button>
                        <button type="button" onClick={() => handleSetPreset(100)} className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/50 text-xs text-cyan-300 hover:bg-slate-800 cursor-pointer">100 DL (1 BGL)</button>
                      </>
                    )}
                    {selectedItem.category === 'bgl' && (
                      <>
                        <button type="button" onClick={() => handleSetPreset(1)} className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer">1 BGL</button>
                        <button type="button" onClick={() => handleSetPreset(2)} className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer">2 BGL</button>
                        <button type="button" onClick={() => handleSetPreset(5)} className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer">5 BGL</button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="text-right sm:text-right p-3 rounded-xl bg-slate-950/80 border border-slate-800 sm:w-60">
                <div className="text-[11px] text-slate-400">Total Pembayaran:</div>
                <div className="text-lg sm:text-xl font-extrabold text-emerald-400">
                  {formatRupiah(totalAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* 2 DATA PEMESANAN & METODE PEMBAYARAN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Input Permintaan Pemesanan (Nama world, Growid, Nomor WA) */}
            <div className="lg:col-span-6 bg-[#0b1120] border border-slate-800/90 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">
                  2
                </span>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                  DATA PEMESANAN
                </h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama World <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: REYFARM99"
                  value={worldName}
                  onChange={(e) => setWorldName(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm uppercase focus:border-emerald-500 focus:outline-hidden font-medium"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Pastikan world ada Donation Box / Display Box.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  GrowID (Username GT) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Reyhan_GT"
                  value={growId}
                  onChange={(e) => setGrowId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-hidden font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomor WhatsApp <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 085124935573"
                  value={contactWa}
                  onChange={(e) => setContactWa(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-hidden font-medium"
                  required
                />
              </div>

              {/* Sell Payout fields if Mode is Jual */}
              {activeMode === 'sell' && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-amber-400">Rekening Pencairan Dana:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Pilihan Bank / E-Wallet</label>
                      <select
                        value={payoutProvider}
                        onChange={(e) => setPayoutProvider(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                      >
                        {USER_PAYOUT_OPTIONS.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">No Rekening / No HP</label>
                      <input
                        type="text"
                        placeholder="Contoh: 085124935573"
                        value={payoutAccountNumber}
                        onChange={(e) => setPayoutAccountNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Nama Pemilik Rekening</label>
                    <input
                      type="text"
                      placeholder="Contoh: REYHAN PRATAMA"
                      value={payoutAccountHolder}
                      onChange={(e) => setPayoutAccountHolder(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs uppercase"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Input Metode Pembayaran (Hanya QRIS, DANA, GOPAY, JAGO) */}
            <div className="lg:col-span-6 bg-[#0b1120] border border-slate-800/90 rounded-2xl p-4 sm:p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">
                      3
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                      PILIH METODE PEMBAYARAN
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PAYMENT_METHODS.map((pay) => {
                    const isSelected = selectedPayment.id === pay.id;
                    return (
                      <button
                        key={pay.id}
                        type="button"
                        onClick={() => setSelectedPayment(pay)}
                        className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 border-emerald-500 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                            : 'bg-[#070c18] border-slate-800/90 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                          {renderPaymentIcon(pay.iconName)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-white truncate">
                            {pay.name}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-semibold">
                            Bebas Biaya Transfer
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button to Proceed to Step 2 */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-[1.01]"
                >
                  <span>Lanjut ke Pembayaran ({formatRupiah(totalAmount)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </form>
      ) : (
        /* STEP 2: HALAMAN PEMBAYARAN (QRIS / REKENING TOKO) + UPLOAD BUKTI BAYAR + REDIRECT WA */
        activeCreatedOrder && (
          <div className="max-w-3xl mx-auto bg-[#0b1120] border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header Status */}
            <div className="text-center pb-4 border-b border-slate-800">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Menunggu Pembayaran & Bukti Transfer</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Selesaikan Pembayaran Pesanan
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Silakan transfer sesuai nominal, lalu upload bukti transfer di bawah ini.
              </p>
            </div>

            {/* Order Brief Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">No. Pemesanan</span>
                <span className="font-bold text-slate-200 font-mono">{activeCreatedOrder.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Nama World</span>
                <span className="font-bold text-emerald-400">{activeCreatedOrder.worldName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">GrowID</span>
                <span className="font-bold text-slate-200">{activeCreatedOrder.growId}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Total Bayar</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  {formatRupiah(activeCreatedOrder.totalAmount)}
                </span>
              </div>
            </div>

            {/* DETAIL PEMBAYARAN SESUAI METODE */}
            <div className="p-4 sm:p-6 rounded-xl bg-slate-900 border border-slate-800">
              {selectedPayment.id === 'qris' ? (
                /* QRIS DISPLAY */
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    <QrCode className="w-4 h-4" />
                    <span>QRIS Realtime - Semua E-Wallet & M-Banking</span>
                  </div>

                  {/* QRIS Code Image / Mock Representation */}
                  <div className="relative p-4 bg-white rounded-2xl shadow-xl w-64 h-64 flex flex-col items-center justify-between border-4 border-slate-800">
                    <div className="text-[11px] font-bold text-slate-900 tracking-wider">
                      GROWSTORE QRIS RESMI
                    </div>
                    {/* Stylized QR Vector Pattern */}
                    <div className="w-44 h-44 bg-slate-950 p-2 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20"></div>
                      <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2">
                        {[...Array(25)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`rounded-xs ${
                              i === 0 || i === 4 || i === 20 || i === 12 || i === 6 || i === 18 || i === 8 || i === 16 || i === 24
                                ? 'bg-emerald-400'
                                : (i % 2 === 0 ? 'bg-white' : 'bg-slate-800')
                            }`}
                          ></div>
                        ))}
                      </div>
                      <div className="absolute center bg-slate-950 p-1.5 rounded-md border border-emerald-500/50">
                        <GtItemIcon type="bgl" size="sm" className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-600 font-semibold">
                      NMID: ID1029384756201
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 max-w-md">
                    Buka GoPay / OVO / DANA / BCA / Livin / BRImo, pilih menu <strong>Scan QR</strong>, lalu scan barcode di atas dan bayar sebesar <strong>{formatRupiah(activeCreatedOrder.totalAmount)}</strong>.
                  </div>
                </div>
              ) : (
                /* REKENING / E-WALLET NOMOR DISPLAY (DANA / GOPAY / JAGO) */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      {renderPaymentIcon(selectedPayment.iconName)}
                      <span className="font-bold text-white text-sm">
                        Rekening / No. Akun Toko ({selectedPayment.name})
                      </span>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold">Tujuan Transfer</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Nomor Rekening / No. HP:</span>
                        <span className="text-lg sm:text-xl font-mono font-extrabold text-white tracking-wider">
                          {selectedPayment.accountNumber || '085124935573'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(selectedPayment.accountNumber || '085124935573')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-colors cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Tersalin' : 'Salin Nomor'}</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Atas Nama (Penerima):</span>
                      <span className="font-bold text-slate-200">
                        {selectedPayment.accountHolder || 'GROWSTORE RESMI'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Nominal Transfer:</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {formatRupiah(activeCreatedOrder.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    {selectedPayment.instruction}
                  </p>
                </div>
              )}
            </div>

            {/* MENU UPLOAD BUKTI PEMBAYARAN */}
            <div className="p-4 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                    Upload Bukti Pembayaran
                  </h4>
                </div>
                {proofFile && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>File Terpilih</span>
                  </span>
                )}
              </div>

              {/* File Input and Dropzone */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-proof-upload"
              />

              {!proofPreviewUrl ? (
                <label
                  htmlFor="file-proof-upload"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500/80 rounded-xl bg-slate-950/60 hover:bg-slate-950 cursor-pointer transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-emerald-300">
                    Klik atau Seret Foto / Screenshot Bukti Transfer
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Format: JPG, PNG, WEBP (Maks 10MB)
                  </span>
                </label>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={proofPreviewUrl}
                      alt="Preview Bukti Pembayaran"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-700"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-200 truncate">
                        {proofFile?.name || 'bukti_transfer.jpg'}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                        &radic; Bukti pembayaran berhasil diupload
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {proofFile ? `${(proofFile.size / 1024).toFixed(1)} KB` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label
                      htmlFor="file-proof-upload"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                    >
                      Ganti Foto
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveProof}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                      title="Hapus Bukti"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Buttons: Confirm & WhatsApp Redirect */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleFinishAndRedirectWa}
                className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/25 hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5 fill-slate-950" />
                <span>Konfirmasi Pembayaran ke WhatsApp (085124935573)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep('form');
                  setErrorMessage('');
                }}
                className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-center"
              >
                &larr; Kembali Ubah Data Pesanan
              </button>
            </div>

          </div>
        )
      )}

    </section>
  );
};
