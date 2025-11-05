import { create } from 'zustand';
import { User } from '@/types';

export interface NotificationItem {
    id: string;
    userId?: string;
    senderId?: string;
    conversationId?: string;
    sender?: Partial<User> | null;
    listingId?: string | null;
    messageId?: string | null;
    text?: string | null;
    read: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: NotificationItem[];
    unreadCount: number;
    setNotifications: (n: NotificationItem[]) => void;
    addNotification: (n: NotificationItem) => void;
    markReadLocal: (id: string) => void;
    setUnreadCount: (c: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    setNotifications: (n) => set({ notifications: n }),
    addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications], unreadCount: s.unreadCount + (n.read ? 0 : 1) })),
    markReadLocal: (id) => set((s) => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n), unreadCount: Math.max(0, s.unreadCount - 1) })),
    setUnreadCount: (c) => set({ unreadCount: c }),
}));

