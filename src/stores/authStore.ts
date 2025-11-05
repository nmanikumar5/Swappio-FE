import { create } from "zustand";
import { User } from "@/types";
import { persistAuth, clearSwappioStorage } from "@/services/auth";

// Initialize from localStorage when available so client routes don't redirect
// to signin before the async hydrator has a chance to run.
let initialUser: User | null = null;
let initialToken: string | null = null;
try {
  if (typeof window !== 'undefined') {
    const u = localStorage.getItem('swappio_user');
    const t = localStorage.getItem('swappio_token');
    if (u) initialUser = JSON.parse(u) as User;
    if (t) initialToken = t;
  }
} catch { /* ignore storage errors */ }

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;
  getAuthHeader: () => Record<string, string> | undefined;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialUser,
  setUser: (user, token) => {
    // persist for legacy/localStorage compat
    try {
      persistAuth(user, token ?? null);
    } catch { }
    set({ user, token: token ?? null, isAuthenticated: !!user });
  },
  logout: () => {
    try {
      persistAuth(null, null);
      clearSwappioStorage();
    } catch { }
    set({ user: null, token: null, isAuthenticated: false });
  },
  getAuthHeader: () => {
    try {
      const token = localStorage.getItem('swappio_token');
      if (token) return { Authorization: `Bearer ${token}` };
    } catch { }
    return undefined;
  },
}));
