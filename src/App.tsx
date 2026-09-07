import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroTransaction } from './components/HeroTransaction';
import { LiveFeedReviews } from './components/LiveFeedReviews';
import { OrderModal } from './components/OrderModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { InitialChoiceModal } from './components/InitialChoiceModal';
import { Footer } from './components/Footer';
import { MarketItem, Order, TransactionMode } from './types';
import { MARKET_ITEMS } from './data/marketData';
import { MessageCircle } from 'lucide-react';

export default function App() {
  // Main selected item & transaction mode
  const [selectedItem, setSelectedItem] = useState<MarketItem>(MARKET_ITEMS[0]); // Diamond Lock default
  const [activeMode, setActiveMode] = useState<TransactionMode>('buy');

  // Modals state
  const [isInitialModalOpen, setIsInitialModalOpen] = useState(true);
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // User state
  const [currentUser] = useState<{ growId: string; name: string } | null>({
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
      paymentFee: 0,
      totalAmount: 80000,
      growId: 'Reyhan_GT',
      worldName: 'REYFARM99',
      contactWa: '085124935573',
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
      contactWa: '085124935573',
      userPayout: {
        provider: 'BCA (Bank Central Asia)',
        accountNumber: '8295018233',
        accountHolder: 'REYHAN PRATAMA',
      },
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ]);

  // Handle choice from initial modal
  const handleSelectInitialMode = (mode: TransactionMode) => {
    setActiveMode(mode);
    setIsInitialModalOpen(false);
    const elem = document.getElementById('transaksi');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Order submission
  const handleSubmitOrder = (newOrder: Order) => {
    setOrdersHistory((prev) => [newOrder, ...prev]);
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

  const scrollToFaq = () => {
    const elem = document.getElementById('faq');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-sky-400 selection:text-slate-950">
      
      {/* Initial Pop-Up Modal (2 choices: Beli BGL/Item vs Jual BGL/Item) */}
      <InitialChoiceModal
        isOpen={isInitialModalOpen}
        onSelectMode={handleSelectInitialMode}
        onClose={() => setIsInitialModalOpen(false)}
      />

      {/* Navigation Header */}
      <Header
        onOpenTracker={() => setIsTrackerOpen(true)}
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

        {/* Live Feed & Reviews Testimonial */}
        <LiveFeedReviews />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Quick Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/6285124935573?text=Halo%20Admin%20dlcheaps,%20saya%20butuh%20bantuan%20transaksi"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-xl shadow-sky-500/30 hover:scale-105 transition-all group cursor-pointer border border-sky-300/40"
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

    </div>
  );
}
