"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Grid,
  Heart,
  MessageSquare,
  Plus,
  User,
  LogOut,
  X,
  Shield,
  MapPin,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { logoutRequest } from "@/services/auth";
import MapboxPlaceAutocomplete from "@/components/location/MapboxPlaceAutocomplete";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const unreadCount = useChatStore((s) => s.unreadCount);
  const [location, setLocation] = useState<string>("");

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Logout error:", error);
    }
    logout();
    onClose();
    router.push("/auth/signin");
  };

  const menuItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dashboard", icon: Grid, label: "Dashboard" },
    { href: "/plans", icon: Zap, label: "💎 Pricing Plans", badge: "new" },
    { href: "/favorites", icon: Heart, label: "Favorites" },
    {
      href: "/chat",
      icon: MessageSquare,
      label: "Messages",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { href: "/post-ad", icon: Plus, label: "Post Ad", highlight: true },
  ];

  const settingsItems = [
    { href: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  if (user?.role === "admin") {
    settingsItems.push({ href: "/admin", icon: Shield, label: "Admin Panel" });
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-2xl md:hidden animate-slide-in-right overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between border-b border-border/50 px-3 sm:px-4 py-3 flex-shrink-0 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center gap-2 min-w-0">
            {user?.photo ? (
              <Image
                src={user.photo}
                alt={user.name || "User"}
                width={40}
                height={40}
                className="h-9 sm:h-10 w-9 sm:w-10 rounded-full object-cover ring-2 ring-primary/20 flex-shrink-0"
              />
            ) : (
              <div className="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-xs sm:text-sm flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-xs sm:text-sm truncate">
                {user?.name || "User"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {user?.email}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Location Selector - Mobile Specific */}
        <div className="border-b border-border/50 px-3 sm:px-4 py-3 flex-shrink-0 bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-foreground">
              Location
            </span>
          </div>
          <MapboxPlaceAutocomplete
            value={location}
            onChange={setLocation}
            onSelect={(place, coords) => {
              setLocation(place);
              console.log("Selected location:", place, coords);
            }}
          />
        </div>

        {/* Main Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-2 py-2 sm:py-3 custom-scrollbar">
          <nav className="space-y-0.5 sm:space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 transition-all text-xs sm:text-sm font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
                      : "text-foreground hover:bg-muted/60"
                  } ${
                    item.highlight
                      ? "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-md"
                      : ""
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`flex h-4 sm:h-5 min-w-4 sm:min-w-5 items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${
                        item.badge === "new"
                          ? "bg-accent text-white"
                          : "bg-accent text-white"
                      }`}
                    >
                      {typeof item.badge === "number"
                        ? item.badge > 9
                          ? "9+"
                          : item.badge
                        : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-2 sm:my-3 border-t border-border/50" />

          {/* Settings Navigation */}
          <div className="space-y-0.5 sm:space-y-1">
            <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Settings
            </div>
            {settingsItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 transition-all text-xs sm:text-sm font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
                      : "text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t border-border/50 p-1.5 sm:p-2 flex-shrink-0 bg-muted/30">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 sm:gap-3 h-9 sm:h-10 text-xs sm:text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 px-3 sm:px-4 py-2"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="flex-1 truncate">Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
}
