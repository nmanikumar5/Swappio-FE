import { create } from "zustand";
import { Conversation, Message } from "@/types";

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  presence: Record<string, { online: boolean; lastSeen?: string | null }>;
  unreadCount: number;
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  replaceMessage: (id: string, message: Message) => void;
  setMessageDelivered: (id: string, deliveredAt?: string) => void;
  markMessagesReadBySender: (senderId: string) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  setPresence: (userId: string, online: boolean, lastSeen?: string | null) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
  setUnreadCount: (count: number) => void;
  resetUnreadCount: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  presence: {},
  unreadCount: 0,
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => {
      // try {
      //   console.log('[CHATSTORE] addMessage', JSON.stringify(message));
      // } catch { }
      return { messages: [...state.messages, message] };
    }),
  replaceMessage: (id, message) =>
    set((state) => {
      // try {
      //   console.log('[CHATSTORE] replaceMessage', id, '->', JSON.stringify(message));
      // } catch { }
      return { messages: state.messages.map((m) => (m.id === id ? message : m)) };
    }),
  setMessageDelivered: (id, deliveredAt) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, isDelivered: true, deliveredAt } : m
      ),
    })),
  markMessagesReadBySender: (senderId) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        String(m.senderId) === String(senderId) ? { ...m, read: true } : m
      ),
    })),
  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, ...(updates as Partial<Conversation>) } : c
      ),
    })),
  setPresence: (userId, online, lastSeen) =>
    set((state) => ({
      presence: { ...state.presence, [userId]: { online, lastSeen } },
    })),
  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  decrementUnreadCount: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  setUnreadCount: (count) => set({ unreadCount: count }),
  resetUnreadCount: () => set({ unreadCount: 0 }),
}));
