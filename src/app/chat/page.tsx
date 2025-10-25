"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search, User } from "lucide-react";

export default function ChatPage() {
  const [message, setMessage] = useState("");

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] max-w-7xl px-4 py-8">
      <div className="grid h-full gap-4 md:grid-cols-[320px_1fr]">
        {/* Conversations List */}
        <Card className="overflow-hidden">
          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-y-auto" style={{ height: "calc(100% - 73px)" }}>
            <div className="p-2">
              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-semibold">No conversations yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start chatting with sellers
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Select a conversation</p>
                <p className="text-sm text-muted-foreground">
                  Choose from the list to start chatting
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>No messages to display</p>
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setMessage("");
              }}
            >
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled
              />
              <Button type="submit" disabled>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Real-time chat will be implemented with Socket.io
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
