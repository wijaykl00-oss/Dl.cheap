export type TransactionMode = 'buy' | 'sell';

export type ItemCategory = 'bgl' | 'dl' | 'items';

export interface MarketItem {
  id: string;
  name: string;
  category: ItemCategory;
  symbol: string;
  badge?: string;
  buyPrice: number;    // Harga user membeli dari toko (IDR)
  sellPrice: number;   // Harga user menjual ke toko (IDR)
  stock: number;       // Stok saat ini
  minOrder: number;
  maxOrder: number;
  unit: string;
  description: string;
  rarityColor: string;
  accentColor: string;
  iconType: 'bgl' | 'dl' | 'wl' | 'rayman' | 'magplant' | 'ghc' | 'wings' | 'geiger';
}

export interface PaymentMethod {
  id: string;
  name: string;
  category: 'qris' | 'bank' | 'ewallet';
  feePercent: number;
  feeFixed: number;
  badge?: string;
  accountNumber?: string;
  accountHolder?: string;
  instruction?: string;
  iconName: string;
}

export interface Order {
  id: string;
  mode: TransactionMode;
  itemId: string;
  itemName: string;
  category: ItemCategory;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  paymentFee: number;
  totalAmount: number;
  growId: string;
  worldName: string;
  contactWa: string;
  paymentMethod?: PaymentMethod;
  userPayout?: {
    provider: string;
    accountNumber: string;
    accountHolder: string;
  };
  dropInstructions?: {
    world: string;
    botName: string;
    securityPin: string;
    boxNote: string;
  };
  status: 'pending_payment' | 'verifying' | 'bot_delivering' | 'completed' | 'cancelled';
  paymentProof?: string;
  paymentProofName?: string;
  createdAt: string;
}

export interface LiveFeedItem {
  id: string;
  type: 'buy' | 'sell';
  growIdMasked: string;
  itemName: string;
  quantity: string;
  totalIdr: string;
  method: string;
  timeAgo: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  growId: string;
  avatar: string;
  rating: number;
  date: string;
  review: string;
  itemTraded: string;
  type: 'buy' | 'sell';
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'umum' | 'beli' | 'jual' | 'keamanan';
}
