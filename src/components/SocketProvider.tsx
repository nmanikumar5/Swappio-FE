"use client";

import React, { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import {
  useNotificationStore,
  NotificationItem,
} from "@/stores/notificationStore";
import { Message } from "@/types";
import { showToast } from "@/components/ui/toast";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setMessageDelivered = useChatStore((s) => s.setMessageDelivered);
  const markMessagesReadBySender = useChatStore(
    (s) => s.markMessagesReadBySender
  );
  const addMessage = useChatStore((s) => s.addMessage);
  const incrementUnreadCount = useChatStore((s) => s.incrementUnreadCount);
  const user = useAuthStore((s) => s.user);
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("swappio_token")
        : null;
    const socket = token ? getSocket() : null;

    let cleanupAttached: (() => void) | null = null;
    let removeStorageListener: (() => void) | null = null;
    let pollTimer: number | null = null;

    function onMessageDelivered(payload: {
      messageId?: string;
      deliveredAt?: string;
    }) {
      if (!payload || !payload.messageId) return;
      setMessageDelivered(payload.messageId, payload.deliveredAt);
    }

    function onMessagesRead(payload: { readBy?: string }) {
      if (!payload || !payload.readBy) return;
      markMessagesReadBySender(payload.readBy);
    }

    function onNewNotification(rawNotification: Record<string, unknown>) {
      try {
        console.log("[SOCKET] New notification received", rawNotification);

        const notification: NotificationItem = {
          id: String(rawNotification._id || rawNotification.id || Date.now()),
          userId: String(rawNotification.userId || ""),
          senderId: String(rawNotification.senderId || ""),
          listingId: rawNotification.listingId
            ? String(rawNotification.listingId)
            : null,
          messageId: rawNotification.messageId
            ? String(rawNotification.messageId)
            : null,
          text: String(rawNotification.text || "New notification"),
          read: false,
          createdAt: String(
            rawNotification.createdAt || new Date().toISOString()
          ),
        };

        // Add to notification store
        addNotification(notification);

        // Show toast notification
        showToast({
          type: "info",
          title: "New Notification",
          description: notification.text || undefined,
        });

        // Show browser notification if permission granted
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          try {
            new Notification("Swappio", {
              body: notification.text || "You have a new notification",
              icon: "/favicon.ico",
              badge: "/favicon.ico",
            });
          } catch (e) {
            console.error("[SOCKET] Browser notification error", e);
          }
        }
      } catch (error) {
        console.error("[SOCKET] Error processing notification", error);
      }
    }

    function onReceiveMessage(rawIn: Record<string, unknown>) {
      try {
        console.log("[SOCKET] raw receive_message payload", rawIn);
      } catch {}
      try {
        const raw = rawIn as unknown as Record<string, unknown>;
        const resolveId = (val?: unknown) => {
          if (!val) return "";
          if (typeof val === "string") return val;
          try {
            const obj = val as Record<string, unknown>;
            if (obj["_id"] && typeof obj["_id"] === "string")
              return String(obj["_id"]);
            if (obj["id"] && typeof obj["id"] === "string")
              return String(obj["id"]);
          } catch {}
          return "";
        };

        const mapped: Message = {
          id: String((raw["_id"] || raw["id"]) ?? ""),
          text: String(raw["text"] ?? ""),
          senderId: resolveId(raw["senderId"]) || resolveId(raw["sender"]),
          receiverId:
            resolveId(raw["receiverId"]) || resolveId(raw["receiver"]),
          listingId: (raw["listingId"] as string) || undefined,
          createdAt: String(raw["createdAt"] ?? new Date()),
          read: !!raw["isRead"],
          isDelivered: !!raw["isDelivered"],
          deliveredAt: raw["deliveredAt"]
            ? String(raw["deliveredAt"])
            : undefined,
        };
        addMessage(mapped);

        // Increment unread count if the message is from someone else and user is not on chat page
        if (user && mapped.senderId !== user.id) {
          const isOnChatPage =
            typeof window !== "undefined" &&
            window.location.pathname === "/chat";
          if (!isOnChatPage) {
            incrementUnreadCount();

            // Show browser notification if permission granted
            if (
              typeof window !== "undefined" &&
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              try {
                new Notification("New message on Swappio", {
                  body: mapped.text,
                  icon: "/favicon.ico",
                  badge: "/favicon.ico",
                });
              } catch (e) {
                console.error("[SOCKET] Notification error", e);
              }
            }
          }
        }
      } catch {
        // ignore
      }
    }

    function onConnect() {
      try {
        console.log("[SOCKET] connected");
      } catch {}
    }

    function onConnectError(err: unknown) {
      try {
        console.error("[SOCKET] connect_error", String(err));
      } catch {}
    }

    const attachListeners = (sckt: ReturnType<typeof getSocket> | null) => {
      if (!sckt) return null;
      sckt.on("connect", onConnect);
      sckt.on("connect_error", onConnectError);
      sckt.on("message_delivered", onMessageDelivered);
      sckt.on("messages_read", onMessagesRead);
      sckt.on("receive_message", onReceiveMessage);
      sckt.on("new_notification", onNewNotification);
      return () => {
        try {
          sckt.off("connect", onConnect);
          sckt.off("connect_error", onConnectError);
          sckt.off("message_delivered", onMessageDelivered);
          sckt.off("messages_read", onMessagesRead);
          sckt.off("receive_message", onReceiveMessage);
          sckt.off("new_notification", onNewNotification);
        } catch {}
      };
    };

    if (socket) cleanupAttached = attachListeners(socket);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "swappio_token" && e.newValue) {
        const s = getSocket();
        if (s && !cleanupAttached) cleanupAttached = attachListeners(s);
      }
    };
    window.addEventListener("storage", onStorage);
    removeStorageListener = () =>
      window.removeEventListener("storage", onStorage);

    pollTimer = window.setInterval(() => {
      try {
        const t = localStorage.getItem("swappio_token");
        if (t) {
          const s = getSocket();
          if (s && !cleanupAttached) {
            cleanupAttached = attachListeners(s);
            if (pollTimer) {
              clearInterval(pollTimer as unknown as number);
              pollTimer = null;
            }
            if (removeStorageListener) removeStorageListener();
          }
        }
      } catch {}
    }, 500);

    return () => {
      try {
        if (cleanupAttached) cleanupAttached();
        if (removeStorageListener) removeStorageListener();
        if (pollTimer) {
          clearInterval(pollTimer as unknown as number);
          pollTimer = null;
        }
      } catch {}
    };
  }, [
    setMessageDelivered,
    markMessagesReadBySender,
    addMessage,
    incrementUnreadCount,
    addNotification,
    user,
  ]);

  return <>{children}</>;
}
