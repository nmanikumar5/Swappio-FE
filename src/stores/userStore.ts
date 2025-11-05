import { create } from "zustand";
import { User } from "@/types";
import { useAuthStore } from "@/stores/authStore";

interface UserState {
    users: User[];
    getUserFromCache: (id: string) => User | undefined;
    setUser: (user: User) => void;
    ensureUser: (id: string) => Promise<User | null>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    getUserFromCache: (id: string) => {
        const s = get();
        return s.users.find((u) => u.id === id);
    },
    setUser: (user: User) =>
        set((state) => ({
            users: state.users.some((u) => u.id === user.id)
                ? state.users.map((u) => (u.id === user.id ? user : u))
                : [...state.users, user],
        })),
    ensureUser: async (id: string) => {
        const s = get();
        const cached = s.users.find((u) => u.id === id);
        if (cached) return cached;
        try {
            // Try to get auth header from auth store
            const authHeader = useAuthStore.getState().getAuthHeader?.();
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (authHeader && authHeader.Authorization) headers.Authorization = authHeader.Authorization;
            const res = await fetch(`${API_URL}/users/${encodeURIComponent(id)}`, { method: 'GET', headers });
            if (!res.ok) return null;
            const body = await res.json().catch(() => null);
            const user = body?.data as User | undefined;
            if (user) {
                set((state) => ({ users: [...state.users, user] }));
                return user;
            }
            return null;
        } catch (e) {
            console.warn('ensureUser failed', e);
            return null;
        }
    },
}));
