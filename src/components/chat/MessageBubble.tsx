"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface Props {
  message: Message;
  isOwn?: boolean;
  senderName?: string;
  senderImage?: string;
  isUnread?: boolean;
}

export default function MessageBubble({
  message,
  isOwn,
  senderName,
  senderImage,
}: Props) {
  return (
    <div
      className={`flex items-end gap-1.5 sm:gap-3 w-full ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwn && (
        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 ring-2 ring-secondary/30 transition-all duration-300 hover:ring-secondary/50">
          {senderImage ? (
            <AvatarImage src={senderImage} alt={senderName} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-secondary/20 to-primary/20 text-xs">
              {senderName?.[0]}
            </AvatarFallback>
          )}
        </Avatar>
      )}

      <div
        className={`max-w-[75%] sm:max-w-[65%] ${
          isOwn ? "text-right" : "text-left"
        }`}
      >
        <div
          className={`inline-block rounded-lg sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-md transition-all duration-300 hover:shadow-lg ${
            isOwn
              ? "bg-gradient-to-br from-primary via-primary to-secondary text-white"
              : "bg-muted/80 backdrop-blur-sm text-foreground border border-border/50"
          }`}
        >
          {message.text}
        </div>
        <div
          className="mt-1 sm:mt-2 text-xs text-muted-foreground flex items-center gap-1"
          style={{ justifyContent: isOwn ? "flex-end" : "flex-start" }}
        >
          <span className="opacity-70 hover:opacity-100 transition-opacity text-[10px] sm:text-xs">
            {formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </span>
          {isOwn && (
            <span aria-hidden className="flex items-center flex-shrink-0">
              {/* Single tick (sent) */}
              {!message.isDelivered && !message.read && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-muted-foreground opacity-60"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {/* Double tick (delivered) */}
              {message.isDelivered && !message.read && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-muted-foreground opacity-80"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 6L11 17L6 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {/* Double blue tick (read) */}
              {message.read && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-info animate-scale-in"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 6L11 17L6 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>

      {isOwn && (
        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 ring-2 ring-primary/30 transition-all duration-300 hover:ring-primary/50">
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xs">
            Me
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
