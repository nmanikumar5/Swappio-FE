"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  MessageSquare,
  Heart,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useNotificationStore,
  NotificationItem,
} from "@/stores/notificationStore";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/ui/toast";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    setNotifications,
    markReadLocal,
    setUnreadCount,
  } = useNotificationStore();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      if (data.success && data.data?.notifications) {
        setNotifications(data.data.notifications);
        const unread = data.data.notifications.filter(
          (n: NotificationItem) => !n.read
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        markReadLocal(id);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedNotifications = notifications.map((n) => ({
          ...n,
          read: true,
        }));
        setNotifications(updatedNotifications);
        setUnreadCount(0);
        showToast({
          type: "success",
          title: "All notifications marked as read",
        });
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      showToast({ type: "error", title: "Failed to update notifications" });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Note: You'll need to add delete endpoint in backend
      // For now, just remove locally
      const updatedNotifications = notifications.filter((n) => n.id !== id);
      setNotifications(updatedNotifications);
      const unread = updatedNotifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
      showToast({ type: "success", title: "Notification deleted" });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getNotificationIcon = (notification: NotificationItem) => {
    if (notification.messageId) {
      return <MessageSquare className="h-4 w-4 text-accent" />;
    }
    if (notification.listingId) {
      return <Package className="h-4 w-4 text-primary" />;
    }
    if (
      notification.text?.includes("favorite") ||
      notification.text?.includes("liked")
    ) {
      return <Heart className="h-4 w-4 text-destructive" />;
    }
    return <Bell className="h-4 w-4 text-muted-foreground" />;
  };

  const getNotificationLink = (notification: NotificationItem) => {
    if (notification.messageId) {
      return "/chat";
    }
    if (notification.listingId) {
      return `/listing/${notification.listingId}`;
    }
    return "#";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-accent/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-destructive text-[10px] font-bold px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <Card className="absolute right-0 top-12 z-50 w-screen max-w-xs sm:w-96 md:max-w-none max-h-[600px] overflow-hidden shadow-xl border-2 gradient-border">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-4">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm sm:text-lg flex items-center gap-1 sm:gap-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">Notifications</span>
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-1 sm:ml-2 text-xs sm:text-sm"
                  >
                    {unreadCount} new
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
                className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
              >
                Unread ({unreadCount})
              </Button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    className="flex-1 text-xs h-8 sm:h-9"
                  >
                    <CheckCheck className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Mark all read</span>
                  </Button>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0 max-h-[450px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-3 sm:mb-4">
                  <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
                <p className="font-semibold text-xs sm:text-sm">
                  No notifications
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {filter === "unread"
                    ? "You're all caught up!"
                    : "Check back later for updates"}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => {
                  const link = getNotificationLink(notification);
                  const NotificationContent = (
                    <div
                      className={cn(
                        "p-2 sm:p-4 hover:bg-accent/5 transition-colors cursor-pointer group relative",
                        !notification.read && "bg-primary/5"
                      )}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                        if (link !== "#") {
                          setIsOpen(false);
                        }
                      }}
                    >
                      <div className="flex gap-2 sm:gap-3">
                        {/* Icon */}
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0">
                          {getNotificationIcon(notification)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1 sm:gap-2">
                            <p className="text-xs sm:text-sm font-medium line-clamp-2">
                              {notification.text || "New notification"}
                            </p>
                            {!notification.read && (
                              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                            )}
                          </div>

                          {notification.sender?.name && (
                            <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">
                              From: {notification.sender.name}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-1 sm:mt-2">
                            <p className="text-xs text-muted-foreground">
                              {formatTime(notification.createdAt)}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-0.5 sm:gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 sm:h-6 sm:w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 sm:h-6 sm:w-6 hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                  return link !== "#" ? (
                    <Link key={notification.id} href={link}>
                      {NotificationContent}
                    </Link>
                  ) : (
                    <div key={notification.id}>{NotificationContent}</div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
