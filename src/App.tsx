import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroTransaction } from './components/HeroTransaction';
import { RateStockTable } from './components/RateStockTable';
import { LiveFeedReviews } from './components/LiveFeedReviews';
import { OrderModal } from './components/OrderModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { MarketItem, Order, TransactionMode } from './types';
import { MARKET_ITEMS } from './data/marketData';
import { MessageCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  // Main selected item & transaction mode
  const [selectedItem, setSelectedItem] = useState<MarketItem>(MARKET_ITEMS[0]); // Diamond Lock default
  const [activeMode, setActiveMode] = useState<TransactionMode>('buy');

  // Modals state
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<{ growId: string; name: string } | null>({
    growId: 'Reyhan_GT',
    name: 'Reyhan Pratama',
  });

  // Orders history
  const [ordersHistory, setOrdersHistory] = useState<Order[]>([
    {
      id: 'INV-GT-92812',
      mode: 'buy',
      itemId: 'dl',
      itemName: 'Diamond Lock (DL)',
      category: 'dl',
      quantity: 25,
      unitPrice: 3200,
      subtotal: 80000,
      paymentFee: 560,
      totalAmount: 80560,
      growId: 'Reyhan_GT',
      worldName: 'REYFARM99',
      contactWa: '08123456789',
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'INV-GT-54120',
      mode: 'sell',
      itemId: 'bgl',
      itemName: 'Blue Gem Lock (BGL)',
      category: 'bgl',
      quantity: 1,
      unitPrice: 285000,
      subtotal: 285000,
      paymentFee: 0,
      totalAmount: 285000,
      growId: 'Reyhan_GT',
      worldName: 'STOREBUY',
      contactWa: '08123456789',
      userPayout: {
        provider: 'BCA (Bank Central Asia)',
        accountNumber: '8295018233',
        accountHolder: 'REYHAN PRATAMA',
      },
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ]);

  // Order submission
  const handleSubmitOrder = (newOrder: Order) => {
    setOrdersHistory((prev) => [newOrder, ...prev]);
    setActiveModalOrder(newOrder);
  };

  // Update order status (simulate completion)
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrdersHistory((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    if (activeModalOrder && activeModalOrder.id === orderId) {
      setActiveModalOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Switch mode from Table action
  const handleSelectTableAction = (item: MarketItem, mode: TransactionMode) => {
    setSelectedItem(item);
    setActiveMode(mode);
    // Smooth scroll to transaction console
    const elem = document.getElementById('transaksi');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToRates = () => {
    const elem = document.getElementById('tabel-rate');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFaq = () => {
    const elem = document.getElementById('faq');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Header
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        onScrollToRates={scrollToRates}
        onScrollToFaq={scrollToFaq}
      />

      {/* Main Content Area */}
      <main>
        {/* Hero Section & Interactive Dynamic Transaction Console */}
        <HeroTransaction
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
          activeMode={activeMode}
          onSwitchMode={setActiveMode}
          onSubmitOrder={handleSubmitOrder}
          userGrowIdPrefill={currentUser?.growId || ''}
        />

        {/* Realtime Rate & Stock Table */}
        <RateStockTable
          onSelectAction={handleSelectTableAction}
        />

        {/* Live Feed & Reviews Testimonial */}
        <LiveFeedReviews />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Quick Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/6281234567890?text=Halo%20Admin%20GrowStore,%20saya%20butuh%20bantuan%20transaksi"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all group"
          title="Chat WhatsApp Customer Support 24 Jam"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 fill-slate-950" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-slate-950"></span>
          </div>
          <span className="hidden sm:inline">CS WhatsApp 24 Jam</span>
        </a>
      </div>

      {/* MODALS */}
      {activeModalOrder && (
        <OrderModal
          order={activeModalOrder}
          onClose={() => setActiveModalOrder(null)}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}

      {isTrackerOpen && (
        <OrderTrackerModal
          orders={ordersHistory}
          onClose={() => setIsTrackerOpen(false)}
          onOpenOrder={(order) => {
            setIsTrackerOpen(false);
            setActiveModalOrder(order);
          }}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user) => setCurrentUser(user)}
        />
      )}

    </div>
  );
}
