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
  ArrowLeft,
  AlertTriangle, 
  QrCode, 
  Wallet, 
  Building2, 
  Smartphone, 
  CheckCircle2, 
  Upload, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Trash2, 
  MessageCircle, 
  Clock,
  Package
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
  // Step state: 1 = Pilih Item, 2 = Data & Jumlah & Metode, 3 = Pembayaran & Upload Bukti
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

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

  // Active created order for Step 3
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

  // Pricing
  const unitPrice = activeMode === 'buy' ? selectedItem.buyPrice : selectedItem.sellPrice;
  const subtotal = quantity * unitPrice;
  const totalAmount = subtotal;

  // Handle Category Switch
  const handleCategoryChange = (cat: ItemCategory) => {
    setActiveCategory(cat);
    const firstInCat = MARKET_ITEMS.find((it) => it.category === cat) || MARKET_ITEMS[0];
    onSelectItem(firstInCat);
    setQuantity(cat === 'bgl' ? 1 : (cat === 'dl' ? 10 : 1));
  };

  // Handle Item Select in Step 1 and proceed to Step 2
  const handleItemSelectAndNext = (item: MarketItem) => {
    onSelectItem(item);
    setActiveCategory(item.category);
    if (item.category === 'bgl') {
      setQuantity(1);
    } else if (item.category === 'dl') {
      setQuantity(10);
    } else if (item.category === 'items') {
      setQuantity(1);
    }
    setErrorMessage('');
    setCurrentStep(2);
    scrollToSection();
  };

  const scrollToSection = () => {
    const elem = document.getElementById('transaksi');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick Preset Adders
  const handleAddQty = (amount: number) => {
    setQuantity((prev) => Math.max(selectedItem.minOrder, Math.min(selectedItem.maxOrder, prev + amount)));
  };

  const handleSetPreset = (targetQty: number) => {
    setQuantity(Math.max(selectedItem.minOrder, Math.min(selectedItem.maxOrder, targetQty)));
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(file);
      setErrorMessage('');
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

  // Validate Step 2 and proceed to Step 3 (Payment & Upload Proof)
  const handleProceedToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!worldName.trim()) {
      setErrorMessage('Silakan isi Nama World Anda!');
      return;
    }
    if (!growId.trim()) {
      setErrorMessage('Silakan isi GrowID (Username GT) Anda!');
      return;
    }
    if (!contactWa.trim()) {
      setErrorMessage('Silakan isi Nomor WhatsApp Anda!');
      return;
    }
    if (quantity < selectedItem.minOrder) {
      setErrorMessage(`Jumlah minimal pesanan adalah ${selectedItem.minOrder} ${selectedItem.unit}`);
      return;
    }

    if (activeMode === 'sell') {
      if (!payoutAccountNumber.trim() || !payoutAccountHolder.trim()) {
        setErrorMessage('Silakan lengkapi data rekening pencairan dana!');
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
      paymentFee: 0,
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
    setCurrentStep(3);
    scrollToSection();
  };

  // Build exact WhatsApp message format requested
  const handleConfirmAndOpenWhatsApp = () => {
    if (!activeCreatedOrder) return;

    if (!proofFile) {
      setErrorMessage('Wajib upload foto bukti pembayaran sebelum bisa melanjutkan ke WhatsApp!');
      return;
    }

    const waNumber = '6285124935573';
    
    let message = `Nopesanan: ${activeCreatedOrder.id}\n`;
    message += `Grow id : ${activeCreatedOrder.growId}\n`;
    message += `Nama world: ${activeCreatedOrder.worldName}\n`;
    message += `Item : ${activeCreatedOrder.itemName}\n`;
    message += `Jumlah : ${activeCreatedOrder.quantity} ${selectedItem.unit}\n`;
    message += `Total Harga : ${formatRupiah(activeCreatedOrder.totalAmount)}\n`;
    message += `Foto bukti pembayaran : (Telah diupload di web: ${proofFile.name})`;

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const renderPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'QrCode': return <QrCode className="w-5 h-5 text-sky-400" />;
      case 'Wallet': return <Wallet className="w-5 h-5 text-blue-400" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-cyan-400" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-sky-300" />;
      default: return <Wallet className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <section id="transaksi" className="pt-4 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Mode Toggle: Beli vs Jual */}
      <div className="mb-6 flex flex-col items-center">
        <div className="inline-flex p-1 rounded-2xl bg-[#081126] border border-blue-900/60 shadow-xl">
          <button
            id="tab-buy"
            type="button"
            onClick={() => {
              onSwitchMode('buy');
              setCurrentStep(1);
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-6 sm:px-10 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeMode === 'buy'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
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
              setCurrentStep(1);
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-6 sm:px-10 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeMode === 'sell'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💰 Jual BGL / Item (Tampung)</span>
          </button>
        </div>
      </div>

      {/* Step Progress Indicator Bar */}
      <div className="mb-6 flex items-center justify-between max-w-xl mx-auto px-2">
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
            currentStep === 1 
              ? 'bg-sky-500 text-slate-950 ring-4 ring-sky-500/20 shadow-md shadow-sky-500/20' 
              : 'bg-blue-950 text-sky-400 border border-sky-500/50'
          }`}>
            1
          </span>
          <span className={`text-xs font-bold ${currentStep === 1 ? 'text-white' : 'text-slate-400'}`}>
            Pilih Barang
          </span>
        </div>
        <div className="h-0.5 w-12 sm:w-20 bg-slate-800">
          <div className={`h-full ${currentStep >= 2 ? 'bg-sky-500' : 'bg-transparent'} transition-all`}></div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
            currentStep === 2 
              ? 'bg-sky-500 text-slate-950 ring-4 ring-sky-500/20 shadow-md shadow-sky-500/20' 
              : currentStep > 2 
                ? 'bg-blue-950 text-sky-400 border border-sky-500/50'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
          }`}>
            2
          </span>
          <span className={`text-xs font-bold ${currentStep === 2 ? 'text-white' : 'text-slate-400'}`}>
            Isi Data & Jumlah
          </span>
        </div>
        <div className="h-0.5 w-12 sm:w-20 bg-slate-800">
          <div className={`h-full ${currentStep === 3 ? 'bg-sky-500' : 'bg-transparent'} transition-all`}></div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
            currentStep === 3 
              ? 'bg-sky-500 text-slate-950 ring-4 ring-sky-500/20 shadow-md shadow-sky-500/20' 
              : 'bg-slate-900 text-slate-500 border border-slate-800'
          }`}>
            3
          </span>
          <span className={`text-xs font-bold ${currentStep === 3 ? 'text-white' : 'text-slate-400'}`}>
            Bayar & Upload
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: HANYA MEMILIH KATEGORI & BARANG */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-[#081022] border border-blue-900/60 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-blue-950/80">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">
                1
              </span>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                PILIH KATEGORI & ITEM
              </h3>
            </div>
            <span className="text-xs text-sky-400 font-medium">
              Klik salah satu barang untuk melanjutkan
            </span>
          </div>

          {/* Category Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleCategoryChange('dl')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeCategory === 'dl'
                  ? 'bg-sky-950/70 border-sky-400 text-sky-300 shadow-md shadow-sky-500/15'
                  : 'bg-[#050b18] border-blue-950 text-slate-400 hover:text-slate-200 hover:border-blue-900'
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
                  ? 'bg-blue-950/70 border-blue-400 text-blue-300 shadow-md shadow-blue-500/15'
                  : 'bg-[#050b18] border-blue-950 text-slate-400 hover:text-slate-200 hover:border-blue-900'
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
                  ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/15'
                  : 'bg-[#050b18] border-blue-950 text-slate-400 hover:text-slate-200 hover:border-blue-900'
              }`}
            >
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-cyan-950 to-blue-950 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.4)] shrink-0">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5V13" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="12" cy="17.5" r="1.3" fill="#38BDF8" />
                </svg>
              </div>
              <span>Item</span>
            </button>
          </div>

          {/* Items Grid (Clicking item automatically proceeds to Step 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {filteredCategoryItems.map((item) => {
              const currentPrice = activeMode === 'buy' ? item.buyPrice : item.sellPrice;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemSelectAndNext(item)}
                  className="p-4 rounded-2xl border border-blue-950/90 bg-[#050c1c] hover:border-sky-500/80 hover:bg-[#0a1532] text-left flex items-center justify-between gap-3 transition-all cursor-pointer group hover:scale-[1.01] hover:shadow-xl hover:shadow-sky-500/10"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GtItemIcon type={item.iconType as any} size="sm" className="w-10 h-10 shrink-0 group-hover:scale-105 transition-transform" />
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Stok: <span className="text-slate-200 font-semibold">{formatNumber(item.stock)}</span> {item.unit}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-sm text-sky-400">
                      {formatRupiah(currentPrice)}
                    </div>
                    <div className="text-[10px] text-slate-400">per {item.unit}</div>
                    <span className="inline-flex items-center gap-0.5 text-[11px] text-sky-400 font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Pilih &rarr;
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: DATA PEMESANAN, JUMLAH ITEM, & PILIH METODE PEMBAYARAN */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <form onSubmit={handleProceedToStep3} className="space-y-6">
          
          {/* Selected Item Banner with change button */}
          <div className="p-4 rounded-2xl bg-[#081022] border border-blue-900/60 flex items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <GtItemIcon type={selectedItem.iconType as any} size="sm" className="w-10 h-10 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">Barang Dipilih:</span>
                <span className="font-bold text-white text-sm sm:text-base">{selectedItem.name}</span>
                <span className="text-xs text-sky-400 font-semibold ml-2">({formatRupiah(unitPrice)} / {selectedItem.unit})</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-3 py-1.5 rounded-xl bg-[#0e1c3e] hover:bg-[#132756] text-xs font-semibold text-sky-300 border border-sky-500/30 transition-colors cursor-pointer"
            >
              Ganti Barang
            </button>
          </div>

          {/* JUMLAH ITEM & TOTAL HARGA */}
          <div className="bg-[#081022] border border-blue-900/60 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-950/80">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                  JUMLAH PESANAN
                </h3>
              </div>
              <div className="text-xs text-slate-400">
                Stok Tersedia: <strong className="text-slate-200">{formatNumber(selectedItem.stock)}</strong> {selectedItem.unit}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center rounded-xl border border-blue-900/80 bg-[#040814] overflow-hidden w-36">
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
                {selectedItem.category === 'dl' && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button type="button" onClick={() => handleSetPreset(10)} className="px-2.5 py-1.5 rounded-lg bg-[#0a1532] border border-blue-900/70 text-xs text-slate-300 hover:border-sky-500/50 cursor-pointer">10 DL</button>
                    <button type="button" onClick={() => handleSetPreset(25)} className="px-2.5 py-1.5 rounded-lg bg-[#0a1532] border border-blue-900/70 text-xs text-slate-300 hover:border-sky-500/50 cursor-pointer">25 DL</button>
                    <button type="button" onClick={() => handleSetPreset(50)} className="px-2.5 py-1.5 rounded-lg bg-[#0a1532] border border-blue-900/70 text-xs text-slate-300 hover:border-sky-500/50 cursor-pointer">50 DL</button>
                    <button type="button" onClick={() => handleSetPreset(100)} className="px-2.5 py-1.5 rounded-lg bg-[#0a1532] border border-sky-500/50 text-xs text-sky-300 hover:bg-sky-950/60 cursor-pointer">100 DL (1 BGL)</button>
                  </div>
                )}
                {selectedItem.category === 'bgl' && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button type="button" onClick={() => handleSetPreset(1)} className="px-2.5 py-1.5 rounded-lg bg-[#0a1532] border border-blue-900/70 text-xs text-slate-300 hover:border-sky-500/50 cursor-pointer">1 BGL</button>
                    <button type="button" onClick={() => handleSetPreset(2)} className="px-2.5 py-1.5 rounded-lg bg-[#0a1532] border border-blue-900/70 text-xs text-slate-300 hover:border-sky-500/50 cursor-pointer">2 BGL</button>
                    <button type="button" onClick={() => handleSetPreset(5)} className="px-2.5 py-1.5 rounded-lg bg-[#0a1532] border border-blue-900/70 text-xs text-slate-300 hover:border-sky-500/50 cursor-pointer">5 BGL</button>
                  </div>
                )}
              </div>

              {/* Total Calculation Display */}
              <div className="p-3 rounded-2xl bg-[#040814] border border-blue-900/80 text-right sm:w-64">
                <span className="text-[11px] text-slate-400 block">Total Harga:</span>
                <span className="text-xl font-extrabold text-sky-400">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* GRID: DATA PEMESANAN & METODE PEMBAYARAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* DATA PEMESANAN: Nama world, Growid, Nomor whatsapp */}
            <div className="bg-[#081022] border border-blue-900/60 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-blue-950/80">
                <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">
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
                  placeholder="CONTOH: REYFARM99"
                  value={worldName}
                  onChange={(e) => setWorldName(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-blue-900/80 text-white text-sm uppercase focus:border-sky-400 focus:outline-hidden font-medium"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-blue-900/80 text-white text-sm focus:border-sky-400 focus:outline-hidden font-medium"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-blue-900/80 text-white text-sm focus:border-sky-400 focus:outline-hidden font-medium"
                  required
                />
              </div>

              {/* Jual mode payout */}
              {activeMode === 'sell' && (
                <div className="pt-3 border-t border-blue-950 space-y-3">
                  <div className="text-xs font-bold text-sky-400">Rekening Pencairan Dana:</div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Bank / E-Wallet</label>
                    <select
                      value={payoutProvider}
                      onChange={(e) => setPayoutProvider(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#040814] border border-blue-900/80 text-white text-xs"
                    >
                      {USER_PAYOUT_OPTIONS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">No Rekening / HP</label>
                    <input
                      type="text"
                      placeholder="Contoh: 085124935573"
                      value={payoutAccountNumber}
                      onChange={(e) => setPayoutAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#040814] border border-blue-900/80 text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Atas Nama (Nama Pemilik)</label>
                    <input
                      type="text"
                      placeholder="Contoh: REYHAN PRATAMA"
                      value={payoutAccountHolder}
                      onChange={(e) => setPayoutAccountHolder(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-lg bg-[#040814] border border-blue-900/80 text-white text-xs uppercase"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PILIH METODE PEMBAYARAN (QRIS, DANA, GOPAY, JAGO) */}
            <div className="bg-[#081022] border border-blue-900/60 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-blue-950/80 mb-3">
                  <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">
                    3
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                    PILIH METODE PEMBAYARAN
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PAYMENT_METHODS.map((pay) => {
                    const isSelected = selectedPayment.id === pay.id;
                    return (
                      <button
                        key={pay.id}
                        type="button"
                        onClick={() => setSelectedPayment(pay)}
                        className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0b1736] border-sky-400 text-white shadow-lg shadow-sky-500/15 ring-1 ring-sky-400/40'
                            : 'bg-[#040814] border-blue-950 text-slate-300 hover:border-blue-900'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#09132c] border border-blue-900/60 flex items-center justify-center shrink-0">
                          {renderPaymentIcon(pay.iconName)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-white truncate">
                            {pay.name}
                          </div>
                          <div className="text-[10px] text-sky-400 font-semibold">
                            Bebas Biaya Transfer
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button to Step 3 */}
              <div className="pt-4 border-t border-blue-950/80 space-y-3">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setErrorMessage('');
                    }}
                    className="py-3.5 px-4 rounded-xl bg-[#0a1532] hover:bg-[#0f204c] text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-900/60"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/25 hover:scale-[1.01]"
                  >
                    <span>Lanjut ke Pembayaran ({formatRupiah(totalAmount)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </form>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: PEMBAYARAN (QRIS / REKENING TOKO) & UPLOAD BUKTI (WAJIB) */}
      {/* ========================================================================= */}
      {currentStep === 3 && activeCreatedOrder && (
        <div className="bg-[#081022] border border-blue-900/60 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header Status */}
          <div className="text-center pb-4 border-b border-blue-950/80">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-2">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Selesaikan Pembayaran & Upload Bukti Transfer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Detail Pembayaran Toko
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Silakan transfer sesuai nominal, lalu wajib upload foto bukti pembayaran di bawah untuk melanjutkan ke WhatsApp.
            </p>
          </div>

          {/* Order Brief Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-[#040814] border border-blue-900/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Nopesanan:</span>
              <span className="font-bold text-white font-mono">{activeCreatedOrder.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Nama World:</span>
              <span className="font-bold text-sky-400">{activeCreatedOrder.worldName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">GrowID:</span>
              <span className="font-bold text-slate-200">{activeCreatedOrder.growId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Total Bayar:</span>
              <span className="font-extrabold text-sky-400 text-sm">
                {formatRupiah(activeCreatedOrder.totalAmount)}
              </span>
            </div>
          </div>

          {/* DETAIL PEMBAYARAN SESUAI METODE (QRIS / REKENING TOKO) */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#050c1c] border border-blue-900/70">
            {selectedPayment.id === 'qris' ? (
              /* QRIS DISPLAY */
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-300 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/30">
                  <QrCode className="w-4 h-4 text-sky-400" />
                  <span>QRIS Realtime - Semua E-Wallet & M-Banking</span>
                </div>

                {/* QRIS Code Graphic */}
                <div className="relative p-4 bg-white rounded-2xl shadow-2xl w-64 h-64 flex flex-col items-center justify-between border-4 border-[#030712]">
                  <div className="text-[11px] font-bold text-slate-900 tracking-wider">
                    DLCHEAPS QRIS RESMI
                  </div>
                  <div className="w-44 h-44 bg-slate-950 p-2 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-blue-600/20"></div>
                    <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2">
                      {[...Array(25)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`rounded-xs ${
                            i === 0 || i === 4 || i === 20 || i === 12 || i === 6 || i === 18 || i === 8 || i === 16 || i === 24
                              ? 'bg-sky-400'
                              : (i % 2 === 0 ? 'bg-white' : 'bg-slate-800')
                          }`}
                        ></div>
                      ))}
                    </div>
                    <div className="absolute center bg-slate-950 p-1.5 rounded-md border border-sky-500/50">
                      <GtItemIcon type="bgl" size="sm" className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 font-semibold">
                    NMID: ID1029384756201
                  </div>
                </div>

                <div className="text-xs text-slate-300 max-w-md">
                  Buka GoPay / OVO / DANA / BCA / Livin / BRImo, pilih menu <strong>Scan QR</strong>, lalu scan barcode di atas dan bayar sebesar <strong className="text-sky-400">{formatRupiah(activeCreatedOrder.totalAmount)}</strong>.
                </div>
              </div>
            ) : (
              /* REKENING / NO AKUN TOKO (DANA / GOPAY / JAGO) */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-blue-950">
                  <div className="flex items-center gap-2">
                    {renderPaymentIcon(selectedPayment.iconName)}
                    <span className="font-bold text-white text-sm">
                      Rekening / No. Akun Toko ({selectedPayment.name})
                    </span>
                  </div>
                  <span className="text-xs text-sky-400 font-semibold">Tujuan Transfer</span>
                </div>

                <div className="p-4 rounded-xl bg-[#030712] border border-blue-900/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Nomor Rekening / No. HP Toko:</span>
                      <span className="text-lg sm:text-xl font-mono font-extrabold text-white tracking-wider">
                        {selectedPayment.accountNumber || '085124935573'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedPayment.accountNumber || '085124935573')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold border border-sky-500/40 transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Tersalin' : 'Salin Nomor'}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-blue-950 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Atas Nama:</span>
                    <span className="font-bold text-white">
                      {selectedPayment.accountHolder || 'DLCHEAPS RESMI'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Nominal Transfer:</span>
                    <span className="font-extrabold text-sky-400 text-sm">
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

          {/* MENU UPLOAD BUKTI PEMBAYARAN (WAJIB UPLOAD) */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#050c1c] border border-blue-900/70 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                  Upload Bukti Pembayaran <span className="text-rose-400 font-bold">*</span>
                </h4>
              </div>
              {proofFile ? (
                <span className="text-xs text-sky-300 font-semibold flex items-center gap-1 bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Bukti Siap</span>
                </span>
              ) : (
                <span className="text-xs text-sky-400 font-semibold bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-sky-500/30">
                  Wajib Diupload
                </span>
              )}
            </div>

            {/* File Input */}
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
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-900/80 hover:border-sky-400/80 rounded-2xl bg-[#030712]/60 hover:bg-[#030712] cursor-pointer transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-2 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-sky-300">
                  Klik untuk Memilih Foto / Screenshot Bukti Transfer
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Format: JPG, PNG, WEBP (Wajib diupload agar bisa lanjut)
                </span>
              </label>
            ) : (
              <div className="p-3 rounded-xl bg-[#030712] border border-blue-900/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={proofPreviewUrl}
                    alt="Preview Bukti Pembayaran"
                    className="w-16 h-16 object-cover rounded-lg border border-blue-900"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs sm:text-sm text-white truncate">
                      {proofFile?.name || 'bukti_transfer.jpg'}
                    </div>
                    <div className="text-[11px] text-sky-400 font-semibold mt-0.5 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Foto bukti bayar berhasil diunggah</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {proofFile ? `${(proofFile.size / 1024).toFixed(1)} KB` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label
                    htmlFor="file-proof-upload"
                    className="px-3 py-1.5 rounded-lg bg-[#0c183a] hover:bg-[#122456] text-xs font-semibold text-sky-300 transition-colors cursor-pointer border border-blue-900/60"
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

          {/* Error notice if trying to proceed without proof */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-300 flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleConfirmAndOpenWhatsApp}
              className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                proofFile 
                  ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/30 hover:scale-[1.01]' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-blue-950'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>
                {proofFile ? 'Kirim Pesanan ke WhatsApp (085124935573)' : 'Upload Bukti Bayar untuk Lanjut'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentStep(2);
                setErrorMessage('');
              }}
              className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-sky-300 transition-colors cursor-pointer text-center"
            >
              &larr; Kembali Ubah Data / Jumlah Pesanan
            </button>
          </div>

        </div>
      )}

    </section>
  );
};
