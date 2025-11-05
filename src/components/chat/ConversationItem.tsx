import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Conversation } from "@/types";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem = React.memo(
  ({ conversation, isActive, onClick }: ConversationItemProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const participant = (conversation as any).participants?.[0];

    return (
      <button
        onClick={onClick}
        className={`w-full text-left p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl transition-all duration-300 group ${
          isActive
            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 scale-[1.01] sm:scale-[1.02]"
            : "hover:bg-accent/50 hover:shadow-md hover:scale-[1.005] sm:hover:scale-[1.01]"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-shrink-0">
            <Avatar className="h-9 sm:h-10 md:h-12 w-9 sm:w-10 md:w-12 flex-shrink-0 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
              <AvatarFallback
                className={
                  isActive
                    ? "bg-white/20 text-white text-xs sm:text-sm"
                    : "bg-gradient-to-br from-primary/20 to-secondary/20 text-xs sm:text-sm"
                }
              >
                {participant?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator dot */}
            <div className="absolute bottom-0 right-0 h-2 w-2 sm:h-3 sm:w-3 bg-success rounded-full border-2 border-background animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <p
              className={`text-xs sm:text-sm md:text-base font-semibold truncate ${
                isActive ? "text-white" : ""
              }`}
            >
              {participant?.name}
            </p>
            <p
              className={`text-xs truncate line-clamp-1 ${
                isActive ? "text-white/80" : "text-muted-foreground"
              }`}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(conversation as any).lastMessage?.text || "No messages yet"}
            </p>
          </div>

          {/* Unread badge - you can add count logic later */}
          {!isActive && (
            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          )}
        </div>
      </button>
    );
  }
);

ConversationItem.displayName = "ConversationItem";

export default ConversationItem;
