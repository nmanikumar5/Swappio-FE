"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Phone } from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";

interface MessageInputProps {
  listingId?: string;
  receiverId?: string;
}

export function MessageInput({ listingId, receiverId }: MessageInputProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { addMessage, replaceMessage } = useChatStore();
  const { user } = useAuthStore();

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || !user || !receiverId || isSending) return;

    const messageText = text.trim();
    setText("");
    setIsSending(true);

    // Create optimistic message for immediate UI feedback
    const optimisticMessage = {
      id: Math.random().toString(36).slice(2, 9),
      text: messageText,
      senderId: user.id,
      receiverId: receiverId,
      listingId: listingId,
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Add to local store immediately for UX
    addMessage(optimisticMessage);
    try {
      console.log(
        "[MESSAGE_INPUT] optimistic message id",
        optimisticMessage.id,
        optimisticMessage.text
      );
    } catch {}

    try {
      // Send via socket for real-time delivery
      const socket = getSocket();
      if (socket && socket.connected) {
        console.log("[MESSAGE_INPUT] emitting via socket send_message");

        socket.emit("send_message", {
          receiverId: receiverId,
          text: messageText,
          listingId: listingId,
        });

        // Listen for message_sent event to get the persisted message ID
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onMessageSent = (savedMessage: any) => {
          try {
            console.log(
              "[MESSAGE_INPUT] server returned message via socket",
              savedMessage?._id || savedMessage?.id,
              savedMessage?.text
            );

            // Replace optimistic message with the real one
            if (savedMessage) {
              const senderId =
                typeof savedMessage.senderId === "object"
                  ? String(
                      savedMessage.senderId._id || savedMessage.senderId.id
                    )
                  : String(savedMessage.senderId);
              const receiverIdResolved =
                typeof savedMessage.receiverId === "object"
                  ? String(
                      savedMessage.receiverId._id || savedMessage.receiverId.id
                    )
                  : String(savedMessage.receiverId);

              replaceMessage(optimisticMessage.id, {
                id: String(savedMessage._id || savedMessage.id),
                text: savedMessage.text || "",
                senderId,
                receiverId: receiverIdResolved,
                listingId: savedMessage.listingId
                  ? String(savedMessage.listingId)
                  : undefined,
                createdAt: savedMessage.createdAt || new Date().toISOString(),
                read: savedMessage.isRead ?? savedMessage.read ?? false,
                isDelivered: savedMessage.isDelivered ?? false,
                deliveredAt: savedMessage.deliveredAt
                  ? String(savedMessage.deliveredAt)
                  : undefined,
              });
            }

            // Remove listener after handling
            socket.off("message_sent", onMessageSent);
          } catch (err) {
            console.error("[MESSAGE_INPUT] Error handling message_sent", err);
          }
        };

        socket.on("message_sent", onMessageSent);

        // Clean up listener after 5 seconds if no response
        setTimeout(() => {
          socket.off("message_sent", onMessageSent);
        }, 5000);
      } else {
        console.warn(
          "[MESSAGE_INPUT] Socket not connected, message may not be delivered in real-time"
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSharePhone = () => {
    if (!user?.phone) {
      toast.error("You don't have a phone number in your profile");
      return;
    }

    const phoneMessage = `📞 Here's my phone number: ${user.phone}`;
    setText(phoneMessage);
    toast.success("Phone number added to message. Click send to share.");
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex gap-2 sm:gap-3 border-t border-primary/20 p-2 sm:p-3 md:p-5 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 flex-shrink-0"
    >
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-lg sm:rounded-xl border-primary/20 focus-visible:ring-primary/50 bg-background/80 backdrop-blur-sm px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base transition-all duration-300 hover:border-primary/30 focus-visible:border-primary/50 shadow-sm"
        disabled={isSending || !receiverId || !user}
      />
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={handleSharePhone}
        disabled={isSending || !receiverId || !user || !user.phone}
        className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg sm:rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        title="Share phone number"
      >
        <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
      </Button>
      <Button
        type="submit"
        size="icon"
        disabled={!text.trim() || isSending || !receiverId || !user}
        className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg sm:rounded-lg md:rounded-xl bg-gradient-to-br from-primary via-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
      >
        {isSending ? (
          <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 animate-spin" />
        ) : (
          <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        )}
      </Button>
    </form>
  );
}
