import { create } from 'zustand';

interface SearchStore {
  query: string;
  setQuery: (q: string) => void;
  recentSearches: string[];
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  query: '',

  setQuery: (q) => set({ query: q }),

  recentSearches: [],

  addRecentSearch: (q) => {
    if (!q.trim()) return;
    const existing = get().recentSearches.filter((s) => s !== q);
    set({ recentSearches: [q, ...existing].slice(0, 5) });
  },

  clearRecentSearches: () => set({ recentSearches: [] }),
}));
