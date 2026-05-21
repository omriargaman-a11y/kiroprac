import { create } from 'zustand';
import { Market } from '../types';
import { markets } from '../data/markets';

interface MarketStore {
  selectedMarket: Market;
  setMarket: (market: Market) => void;
}

export const useMarketStore = create<MarketStore>(() => ({
  selectedMarket: markets[0],
  setMarket: (market) => ({ selectedMarket: market }),
}));
