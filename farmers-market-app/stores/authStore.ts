import { create } from 'zustand';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  signIn: (name, email) => set({ user: { name, email } }),
  signOut: () => set({ user: null }),
}));
