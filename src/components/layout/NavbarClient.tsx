"use client";

import Link from "next/link";
import { Plus, Heart, MessageSquare, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import SocketStatus from "@/components/SocketStatus";
import { logoutRequest } from "@/services/auth";
import MobileMenu from "./MobileMenu";
import NotificationBell from "@/components/notifications/NotificationBell";
import LocationSelector from "./LocationSelector";

export default function NavbarClient() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const unreadCount = useChatStore((s) => s.unreadCount);
  const resetUnreadCount = useChatStore((s) => s.resetUnreadCount);

  // Use auth store directly - it's already hydrated by AuthHydrator
  const effectiveUser = user || null;
  const showMenu = !!isAuthenticated;

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Logout error:", error);
    }
    logout();
    router.push("/auth/signin");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo with gradient */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30 transition-all group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:scale-105">
                <span className="text-xl font-bold">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent hidden sm:inline">
                Swappio
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Location Selector - Hidden on very small screens */}
              <div className="hidden lg:flex">
                <LocationSelector />
              </div>

              {/* Socket Status */}
              {isAuthenticated && (
                <div className="hidden sm:flex items-center">
                  <SocketStatus />
                </div>
              )}

              {/* Plans Button - Visible to All */}
              <Link href="/plans">
                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2 border-2 border-primary/50 hover:border-primary hover:bg-primary/10 transition-all text-xs md:text-sm px-2 md:px-4"
                >
                  <span className="text-base md:text-lg">💎</span>
                  <span className="font-semibold hidden md:inline">Plans</span>
                </Button>
              </Link>

              {/* Post Ad Button */}
              {isAuthenticated && (
                <Link href="/post-ad">
                  <Button className="hidden sm:flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-md hover:shadow-lg transition-all text-xs md:text-sm px-2 md:px-4 py-2 h-8 md:h-10">
                    <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="font-semibold hidden md:inline">
                      Post Ad
                    </span>
                  </Button>
                </Link>
              )}

              {/* profile menu with avatar - includes Dashboard, Profile and Logout */}

              {showMenu ? (
                <>
                  {/* Favorites Button */}
                  <Link href="/favorites">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 relative hover:bg-primary/10 transition-colors flex-shrink-0"
                    >
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-foreground hover:text-primary transition-colors" />
                    </Button>
                  </Link>

                  {/* Notification Bell */}
                  <NotificationBell />

                  {/* Chat Button */}
                  <Link href="/chat" onClick={() => resetUnreadCount()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 relative hover:bg-primary/10 transition-colors flex-shrink-0"
                    >
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-foreground hover:text-primary transition-colors" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-accent to-accent/80 rounded-full shadow-lg shadow-accent/50 animate-badge-bump">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  {/* User Menu */}
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="rounded-full ring-2 ring-transparent hover:ring-primary/30 transition-all h-8 w-8 sm:h-10 sm:w-10">
                        {effectiveUser?.id ? (
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shadow-md hover:shadow-lg transition-shadow duration-200">
                            {effectiveUser?.photo ? (
                              <AvatarImage
                                src={effectiveUser.photo}
                                alt={effectiveUser.name ?? "User"}
                                className="rounded-full object-cover w-full h-full"
                              />
                            ) : null}
                            <AvatarFallback className="rounded-full w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-bold text-xs sm:text-lg">
                              {effectiveUser?.name?.[0]?.toUpperCase() ?? "U"}
                            </AvatarFallback>
                          </Avatar>
                        ) : null}
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl w-48 sm:w-56 p-1.5 sm:p-2 mt-2 border border-border/50 animate-scale-in">
                      <div className="px-2 sm:px-3 py-1.5 sm:py-2 border-b border-border/50 mb-1">
                        <div className="text-xs sm:text-sm font-semibold text-foreground truncate">
                          {effectiveUser?.name ?? "User"}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {effectiveUser?.email}
                        </div>
                      </div>
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground hover:bg-primary/10 rounded-md transition-colors cursor-pointer"
                        >
                          <span className="text-base sm:text-lg">📊</span>{" "}
                          Dashboard
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground hover:bg-primary/10 rounded-md transition-colors cursor-pointer"
                        >
                          <span className="text-base sm:text-lg">👤</span>{" "}
                          Profile
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="my-1 border-t border-border/50" />
                      <DropdownMenu.Item asChild>
                        <button
                          className="flex items-center gap-2 w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors cursor-pointer"
                          onClick={handleLogout}
                        >
                          <span className="text-base sm:text-lg">🚪</span>{" "}
                          Logout
                        </button>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </>
              ) : (
                <>
                  {pathname !== "/auth/signin" && (
                    <Link href="/auth/signin">
                      <Button
                        variant="ghost"
                        className="hidden sm:inline hover:bg-primary/10"
                      >
                        Sign in
                      </Button>
                    </Link>
                  )}
                  {pathname !== "/auth/signup" && (
                    <Link href="/auth/signup">
                      <Button className="hidden sm:inline bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-md hover:shadow-lg transition-all">
                        Sign up
                      </Button>
                    </Link>
                  )}
                </>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Must be outside nav for proper z-index stacking */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
      />
    </>
  );
}
