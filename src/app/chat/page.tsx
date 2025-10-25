'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar } from '@radix-ui/react-avatar'
import { Send, Search } from 'lucide-react'
import { Chat, Message } from '@/types'

// Mock data
const mockChats: Chat[] = [
  {
    id: '1',
    participants: [
      {
        id: 'user1',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        role: 'user',
        createdAt: new Date(),
      },
    ],
    product: {
      id: '1',
      title: 'iPhone 14 Pro Max',
      description: '',
      price: 125000,
      images: ['https://images.unsplash.com/photo-1678652197950-1cdd5b4e0d1f?w=100&h=100&fit=crop'],
      category: 'electronics',
      condition: 'new',
      location: 'Mumbai',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      isFeatured: false,
    },
    lastMessage: {
      id: '1',
      content: 'Is this still available?',
      senderId: 'user1',
      receiverId: 'me',
      createdAt: new Date(),
      read: false,
    },
    updatedAt: new Date(),
  },
]

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedChat) {
      // In real app, fetch messages for the selected chat
      setMessages([
        {
          id: '1',
          content: 'Is this still available?',
          senderId: 'user1',
          receiverId: 'me',
          createdAt: new Date(),
          read: true,
        },
        {
          id: '2',
          content: 'Yes, it is! Are you interested?',
          senderId: 'me',
          receiverId: 'user1',
          createdAt: new Date(),
          read: true,
        },
      ])
    }
  }, [selectedChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: 'me',
      receiverId: selectedChat.participants[0].id,
      createdAt: new Date(),
      read: false,
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50">
      <div className="container mx-auto px-4 h-full py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Chat List */}
          <Card className="lg:col-span-1 overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search chats..." className="pl-10" />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-8rem)]">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-4 border-b hover:bg-gray-50 transition-colors text-left ${
                    selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {chat.participants[0].name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <p className="font-semibold truncate">{chat.participants[0].name}</p>
                        <span className="text-xs text-muted-foreground">2h ago</span>
                      </div>
                      {chat.product && (
                        <p className="text-xs text-muted-foreground mb-1 truncate">
                          {chat.product.title}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage?.content}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 overflow-hidden flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedChat.participants[0].name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{selectedChat.participants[0].name}</p>
                    {selectedChat.product && (
                      <p className="text-sm text-muted-foreground">{selectedChat.product.title}</p>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.senderId === 'me'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select a chat to start messaging</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
