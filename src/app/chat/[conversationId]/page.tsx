"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
const ChatWindow = dynamic(() => import("@/components/chat/ChatWindow"), {
  ssr: false,
  loading: () => <Skeleton className="h-[600px] w-full" />,
});
import { useChatStore } from "@/stores/chatStore";
import { messageService } from "@/services/api";
import { useParams } from "next/navigation";
import { Conversation } from "@/types";

export default function ConversationPage() {
  const { conversationId } = useParams();
  const setConversations = useChatStore((s) => s.setConversations);
  const setMessages = useChatStore((s) => s.setMessages);
  const setCurrentConversation = useChatStore((s) => s.setCurrentConversation);

  useEffect(() => {
    (async () => {
      try {
        const convs = await messageService.getConversations();
        setConversations(convs);
        if (conversationId) {
          const convIdStr = Array.isArray(conversationId)
            ? conversationId[0]
            : String(conversationId);

          // conversationId is encoded as `${otherId}_${listingId}` (see mapConversationRaw)
          const [otherId, listingId] = convIdStr.split("_");

          // find a matching conversation by the full id
          const matched = convs.find((c: Conversation) => c.id === convIdStr);
          if (matched) {
            setCurrentConversation(matched as Conversation);
          } else {
            // if not found, create a minimal conversation with a single participant
            const participant = {
              id: otherId,
              name: "Unknown",
              email: "",
              image: undefined,
              createdAt: new Date().toISOString(),
              role: "user",
            };
            setCurrentConversation({
              id: convIdStr,
              participants: [participant],
              lastMessage: {
                id: `init-${convIdStr}`,
                text: "",
                senderId: "",
                receiverId: "",
                createdAt: new Date().toISOString(),
                read: false,
              },
              listing: listingId
                ? { id: listingId, title: undefined }
                : undefined,
              unreadCount: 0,
            } as unknown as Conversation);
          }

          // load messages for the other user (pass otherId, not the combined conversation id)
          try {
            const uid = otherId || convIdStr;
            const { messages } = await messageService.getMessages(uid);
            setMessages(messages);
          } catch (err) {
            console.error(
              "Failed to load messages for conversationId:",
              conversationId,
              err
            );
          }
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    })();
  }, [conversationId, setConversations, setMessages, setCurrentConversation]);

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] max-w-7xl px-4 py-8">
      <ChatWindow />
    </div>
  );
}
