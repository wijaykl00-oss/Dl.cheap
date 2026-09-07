import { LiveFeedItem } from '../types';
import { formatRupiah } from './formatters';

const GROW_IDS = [
  'Rey***99', 'Bintang***', 'Dimas***GT', 'Aldi***Farm', 'Fahri***GT', 
  'Chri***Pro', 'Aditya***', 'Farhan***GT', 'Bayu***99', 'Kurnia***', 
  'Zack***GT', 'Danu***WL', 'Bima***GT', 'Fikri***Pro', 'Kevin***GT', 
  'Teguh***Farm', 'Arya***88', 'Hendra***', 'Putra***GT', 'Dika***99',
  'Gerry***GT', 'Rizky***99', 'Taufik***Pro', 'Gilang***', 'Vino***GT'
];

const ITEMS_POOL = [
  { name: 'Diamond Lock (DL)', unit: 'DL', buyPrice: 3200, sellPrice: 2850, quantities: [10, 20, 25, 30, 50, 75, 100] },
  { name: 'Blue Gem Lock (BGL)', unit: 'BGL', buyPrice: 315000, sellPrice: 285000, quantities: [1, 2, 3, 5] },
  { name: 'World Lock (WL Pack 100x)', unit: 'Pack', buyPrice: 3500, sellPrice: 2700, quantities: [5, 10, 20, 50] },
  { name: "Rayman's Fist", unit: 'Pcs', buyPrice: 1450000, sellPrice: 1320000, quantities: [1] },
  { name: 'Magplant 5000', unit: 'Pcs', buyPrice: 890000, sellPrice: 790000, quantities: [1] },
  { name: 'Golden Dragon Wings', unit: 'Pcs', buyPrice: 240000, sellPrice: 210000, quantities: [1, 2] },
  { name: 'Geiger Counter (Alive)', unit: 'Pcs', buyPrice: 45000, sellPrice: 36000, quantities: [2, 5, 10] },
];

const METHODS = ['QRIS', 'DANA', 'GoPay', 'Bank Jago'];

// Pseudo-random deterministic number generator from seed
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateDynamicLogs(timeBlock: number): LiveFeedItem[] {
  const logs: LiveFeedItem[] = [];
  const count = 7;
  const minutesOffsets = [2, 5, 9, 14, 19, 24, 28];

  for (let i = 0; i < count; i++) {
    const seed = timeBlock * 100 + i * 17;
    const type: 'buy' | 'sell' = pseudoRandom(seed + 1) > 0.35 ? 'buy' : 'sell';
    
    const idIdx = Math.floor(pseudoRandom(seed + 2) * GROW_IDS.length);
    const growId = GROW_IDS[idIdx];

    const itemIdx = Math.floor(pseudoRandom(seed + 3) * ITEMS_POOL.length);
    const item = ITEMS_POOL[itemIdx];

    const qtyIdx = Math.floor(pseudoRandom(seed + 4) * item.quantities.length);
    const qty = item.quantities[qtyIdx];

    const methodIdx = Math.floor(pseudoRandom(seed + 5) * METHODS.length);
    const method = METHODS[methodIdx];

    const unitPrice = type === 'buy' ? item.buyPrice : item.sellPrice;
    const total = qty * unitPrice;

    logs.push({
      id: `log-${timeBlock}-${i}`,
      type,
      growIdMasked: growId,
      itemName: item.name,
      quantity: `${qty} ${item.unit}`,
      totalIdr: formatRupiah(total),
      method,
      timeAgo: `${minutesOffsets[i]} menit lalu`,
    });
  }

  return logs;
}
