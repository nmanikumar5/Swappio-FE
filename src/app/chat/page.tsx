"use client";

import React, { useEffect, useState } from "react";
import ChatWindow from "@/components/chat/ChatWindow";
import { useChatStore } from "@/stores/chatStore";
import { messageService } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent } from "@/components/ui/card";
import SocketStatus from "@/components/SocketStatus";
import { Loader2 } from "lucide-react";
// types used inline

export default function ChatPage() {
  const setConversations = useChatStore((s) => s.setConversations);
  const setCurrentConversation = useChatStore((s) => s.setCurrentConversation);
  const setMessages = useChatStore((s) => s.setMessages);
  const resetUnreadCount = useChatStore((s) => s.resetUnreadCount);
  const authUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset unread count when visiting chat page
  useEffect(() => {
    resetUnreadCount();
  }, [resetUnreadCount]);

  useEffect(() => {
    const loadConversations = async () => {
      // Wait for auth to be loaded
      if (!isAuthenticated || !authUser?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const rawConversations = await messageService.getConversations();

        if (!Array.isArray(rawConversations)) {
          setConversations([]);
          setMessages([]);
          setCurrentConversation(null);
          setLoading(false);
          return;
        }

        // Transform backend conversations to match frontend types and
        // normalize participant ids (use backend _id -> participant.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const conversations = rawConversations.map((conv: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sender = conv.sender as any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const receiver = conv.receiver as any;

          // pick the other user (not the authenticated user)
          const otherRaw =
            String(sender._id) === String(authUser?.id) ? receiver : sender;

          // normalize participant shape for frontend expectations
          const participant = {
            id: String(otherRaw._id || otherRaw.id),
            name: otherRaw.name,
            email: otherRaw.email || "",
            image: otherRaw.photo || otherRaw.image || undefined,
            createdAt: otherRaw.createdAt || new Date().toISOString(),
            role: otherRaw.role || "user",
          };

          return {
            id: String(conv._id || conv.id),
            participants: [participant],
            lastMessage: {
              id: String(conv._id || conv.id),
              text: conv.text as string,
              senderId: String(conv.sender?._id || conv.sender?.id),
              receiverId: String(conv.receiver?._id || conv.receiver?.id),
              createdAt: conv.createdAt as string,
              read: conv.isRead || false,
            },
            listing: conv.listing
              ? {
                  id: String(conv.listing._id || conv.listing.id),
                  title: conv.listing.title,
                }
              : undefined,
            unreadCount: 0,
          };
        }) as unknown as any[];

        setConversations(conversations);

        // If we have conversations, set the first one as current and load its messages
        if (conversations.length > 0 && rawConversations.length > 0) {
          const firstConv = conversations[0];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const firstRawConv = rawConversations[0] as any;
          setCurrentConversation(firstConv);

          // Use the other user's ID from the raw conversation
          const otherUserId =
            String(firstRawConv.sender._id) === String(authUser?.id)
              ? String(firstRawConv.receiver._id)
              : String(firstRawConv.sender._id);

          const messagesData = await messageService.getMessages(otherUserId);
          setMessages(messagesData?.messages || []);
        } else {
          setMessages([]);
          setCurrentConversation(null);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to load conversations:", err);
        setError("Failed to load conversations. Please try again.");
        setMessages([]);
        setCurrentConversation(null);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [
    isAuthenticated,
    authUser?.id,
    setConversations,
    setMessages,
    setCurrentConversation,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-12 w-48 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg animate-shimmer" />
          </div>
          <Card className="h-[80vh] glass border-primary/20">
            <CardContent className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-semibold text-gradient">
                  Loading conversations...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <Card className="h-[80vh] glass border-destructive/30">
            <CardContent className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-destructive"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-destructive font-semibold text-lg">
                  {error}
                </p>
                <p className="text-muted-foreground">Please try again later</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-primary/5 to-secondary/5 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gradient">Messages</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Stay connected with your exchange partners
            </p>
          </div>
          <SocketStatus />
        </div>

        {/* Chat Window */}
        <div className="h-[calc(100vh-200px)]">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}
