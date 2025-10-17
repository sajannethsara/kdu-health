import { create } from "zustand";

export const useUserStore = create((set) => ({
  // Initial state
  user: null,
  // Actions
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
}));
