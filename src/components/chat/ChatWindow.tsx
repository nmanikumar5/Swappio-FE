"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useChatStore } from "@/stores/chatStore";
import { messageService } from "@/services/api";
import MessageBubble from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import ConversationItem from "./ConversationItem";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/authStore";
import { User } from "@/types";
import { Loader2, ChevronLeft } from "lucide-react";

export default function ChatWindow() {
  const conversations = useChatStore((s) => s.conversations);
  const messages = useChatStore((s) => s.messages);
  const setMessages = useChatStore((s) => s.setMessages);
  const currentConv = useChatStore((s) => s.currentConversation);
  const setCurrentConversation = useChatStore((s) => s.setCurrentConversation);

  const authUser = useAuthStore((s) => s.user);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mobileViewConversation, setMobileViewConversation] = useState(false);

  // Get other participant in current conversation - memoized to prevent rerenders
  const otherUser = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (currentConv as any)?.participants?.[0] as User | undefined;
  }, [currentConv]);

  // Auto-scroll to bottom when messages change - optimized
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Load messages when conversation changes - memoized callback
  const loadMessages = useCallback(async () => {
    if (!currentConv?.id || !otherUser?.id) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    try {
      const result = await messageService.getMessages(otherUser.id);
      setMessages(result.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [currentConv?.id, otherUser?.id, setMessages]);

  // Load messages when conversation changes
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  if (!authUser) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">Not authenticated</p>
        </CardContent>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <p className="text-lg font-semibold mb-2">No conversations</p>
          <p className="text-muted-foreground">Start a chat from a listing</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid h-full gap-2 sm:gap-4 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
      {/* Conversations Sidebar */}
      <div
        className={`${
          mobileViewConversation ? "hidden md:flex" : "flex"
        } flex-col min-h-0`}
      >
        <Card className="flex flex-col h-full overflow-hidden glass border-primary/20 shadow-lg">
          <CardHeader className="border-b border-primary/20 py-3 px-3 sm:py-4 sm:px-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 flex-shrink-0">
            <h2 className="font-bold text-sm sm:text-base md:text-lg text-gradient">
              Conversations
            </h2>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-0 custom-scrollbar min-h-0">
            <div className="space-y-1 sm:space-y-2 p-2 sm:p-3">
              {conversations.map((conv) => {
                const isActive = currentConv?.id === conv.id;
                return (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={isActive}
                    onClick={() => {
                      setCurrentConversation(conv);
                      setMobileViewConversation(true);
                    }}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div
        className={`${
          mobileViewConversation ? "flex" : "hidden md:flex"
        } flex-col min-h-0`}
      >
        <Card className="flex flex-col h-full overflow-hidden glass border-primary/20 shadow-xl">
          {/* Chat Header */}
          <CardHeader className="border-b border-primary/20 py-3 px-3 sm:py-4 sm:px-4 md:px-5 flex-row items-center gap-2 sm:gap-3 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 flex-shrink-0 min-h-0">
            <button
              onClick={() => setMobileViewConversation(false)}
              className="md:hidden p-1 sm:p-2 hover:bg-accent/50 rounded-lg transition-all duration-300 hover:scale-105 flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {otherUser ? (
              <>
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-9 sm:h-10 md:h-12 w-9 sm:w-10 md:w-12 ring-2 ring-primary/30">
                      <AvatarImage
                        src={otherUser.image || ""}
                        alt={otherUser.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                        {otherUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-2 sm:h-3 w-2 sm:w-3 bg-success rounded-full border-2 border-background animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base md:text-lg truncate">
                      {otherUser.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-success rounded-full animate-pulse" />
                      Active now
                    </p>
                  </div>
                </div>

                {/* Listing Reference - if available */}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(currentConv as any)?.listing && (
                  <div className="hidden sm:flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 bg-card/50 backdrop-blur-sm rounded-lg md:rounded-xl border-2 shadow-md max-w-xs md:max-w-md flex-shrink-0">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(currentConv as any).listing?.images?.[0] && (
                      <Image
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        src={(currentConv as any).listing.images[0]}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        alt={(currentConv as any).listing.title}
                        width={40}
                        height={40}
                        className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(currentConv as any).listing.title}
                      </p>
                      <p className="text-xs text-primary font-bold">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        ${(currentConv as any).listing.price}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground">
                Select a conversation
              </p>
            )}
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-background via-background to-muted/30 custom-scrollbar min-h-0">
            {loadingMessages ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader2 className="h-6 sm:h-8 w-6 sm:w-8 animate-spin text-primary" />
                <p className="text-xs sm:text-sm text-muted-foreground animate-pulse">
                  Loading messages...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 animate-fade-in px-4">
                <div className="h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <svg
                    className="h-8 sm:h-10 w-8 sm:w-10 text-primary"
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
                </div>
                <p className="text-sm sm:text-lg font-semibold">
                  No messages yet
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Start the conversation!
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => {
                  const isOwn = msg.senderId === authUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isOwn ? "justify-end" : "justify-start"
                      } animate-slide-in`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <MessageBubble
                        message={msg}
                        isOwn={isOwn}
                        senderName={isOwn ? authUser.name : otherUser?.name}
                        senderImage={isOwn ? authUser.image : otherUser?.image}
                      />
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>

          {/* Message Input */}
          {currentConv && otherUser ? (
            <MessageInput receiverId={otherUser.id} listingId={undefined} />
          ) : (
            <CardContent className="border-t border-primary/20 p-3 sm:p-4 md:p-6 text-center text-xs sm:text-sm text-muted-foreground bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 flex-shrink-0">
              Select a conversation to start messaging
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
