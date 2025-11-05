"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListingCard from "@/components/listing/ListingCard";
import {
  User,
  Package,
  Heart,
  MessageSquare,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  RefreshCw,
  BarChart3,
  Edit,
} from "lucide-react";
import {
  listingService,
  messageService,
  favoriteService,
} from "@/services/api";
import { useListingStore } from "@/stores/listingStore";
import { useChatStore } from "@/stores/chatStore";
import { Listing, Conversation } from "@/types";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("listings");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const listingStore = useListingStore();
  const chatStore = useChatStore();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Fetch user's listings from backend
        const listingsRes = await listingService.getMyListings(1, 50);
        const userListingsData = listingsRes.listings || [];
        setMyListings(userListingsData);
        listingStore.setListings(userListingsData);

        // Load favorites (server-side: marked with isFavorite flag)
        const favList = userListingsData.filter((l) => l.isFavorite === true);
        setFavorites(favList);

        // Load conversations
        try {
          const convs = await messageService.getConversations();
          setConversations(convs as Conversation[]);
          chatStore.setConversations(convs as Conversation[]);
        } catch (e) {
          console.warn("Failed to load conversations", e);
        }
      } catch (e) {
        console.error("Dashboard load failed", e);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount to avoid repeated API calls

  async function refreshListings() {
    try {
      const res = await listingService.getMyListings(1, 50);
      const userListingsData = res.listings || [];
      setMyListings(userListingsData);
      listingStore.setListings(userListingsData);
      const favList = userListingsData.filter((l) => l.isFavorite === true);
      setFavorites(favList);
    } catch (e) {
      console.error("refreshListings failed", e);
    }
  }

  async function handleDelete(listingId: string) {
    if (!confirm("Delete this listing?")) return;
    try {
      await listingService.deleteListing(listingId);
      await refreshListings();
    } catch (e) {
      console.error("Delete failed", e);
    }
  }

  async function handleUnfavorite(listingId: string) {
    try {
      await favoriteService.removeFavorite(listingId);
      // Remove from local state
      setFavorites((f) => f.filter((x) => x.id !== listingId));
      // Also refresh listings to update isFavorite flags
      await refreshListings();
    } catch (e) {
      console.error("Unfavorite failed", e);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4 md:p-8 animate-fade-in">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gradient">
            My Dashboard
          </h1>
          <p className="text-lg text-muted-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Manage your listings, track performance, and grow your presence
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Active Ads Card */}
          <Card className="glass border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                  <Package className="h-7 w-7 text-primary" />
                </div>
                <TrendingUp className="h-5 w-5 text-success opacity-70" />
              </div>
              <p className="text-4xl font-bold mb-1 text-gradient">
                {myListings.length}
              </p>
              <p className="text-sm text-muted-foreground">Active Listings</p>
              <div className="mt-3 pt-3 border-t border-border/50">
                <Link href="/post-ad">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full hover:bg-primary/10 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Post New Ad
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Favorites Card */}
          <Card className="glass border-secondary/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:from-secondary/30 group-hover:to-secondary/20 transition-colors">
                  <Heart className="h-7 w-7 text-secondary" />
                </div>
                <Eye className="h-5 w-5 text-info opacity-70" />
              </div>
              <p className="text-4xl font-bold mb-1 text-gradient">
                {favorites.length}
              </p>
              <p className="text-sm text-muted-foreground">Saved Items</p>
              <div className="mt-3 pt-3 border-t border-border/50">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full hover:bg-secondary/10 text-xs"
                  onClick={() => setActiveTab("favorites")}
                >
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Messages Card */}
          <Card className="glass border-accent/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20 transition-colors">
                  <MessageSquare className="h-7 w-7 text-accent" />
                </div>
                <Clock className="h-5 w-5 text-warning opacity-70" />
              </div>
              <p className="text-4xl font-bold mb-1 text-gradient">
                {conversations.length}
              </p>
              <p className="text-sm text-muted-foreground">Conversations</p>
              <div className="mt-3 pt-3 border-t border-border/50">
                <Link href="/chat">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full hover:bg-accent/10 text-xs"
                  >
                    Open Messages
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card className="glass border-info/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-info/20 to-info/10 group-hover:from-info/30 group-hover:to-info/20 transition-colors">
                  <User className="h-7 w-7 text-info" />
                </div>
                <CheckCircle className="h-5 w-5 text-success opacity-70" />
              </div>
              <p className="text-xl font-bold mb-1">Profile</p>
              <p className="text-sm text-muted-foreground mb-3">
                Manage account
              </p>
              <div className="mt-3 pt-3 border-t border-border/50">
                <Link href="/dashboard/profile">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full hover:bg-info/10 text-xs"
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass border-primary/20 mb-8">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-5">
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/post-ad" className="group">
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-primary/10 transition-all duration-300 hover:scale-105">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-center">
                    Post Ad
                  </span>
                </div>
              </Link>

              <Link href="/chat" className="group">
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-secondary/10 transition-all duration-300 hover:scale-105">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-center">
                    Messages
                  </span>
                </div>
              </Link>

              <Link href="/favorites" className="group">
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-accent/10 transition-all duration-300 hover:scale-105">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-center">
                    Favorites
                  </span>
                </div>
              </Link>

              <button onClick={refreshListings} className="group">
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-info/10 transition-all duration-300 hover:scale-105">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-info to-secondary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <RefreshCw className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-center">
                    Refresh
                  </span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="listings">
            <Card className="glass border-primary/20">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">My Listings</h2>
                  <Link href="/post-ad">
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-md hover:shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Ad
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                    <RefreshCw className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">
                      Loading your listings...
                    </p>
                  </div>
                ) : myListings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {myListings.map((listing: Listing) => (
                      <div key={listing.id} className="relative group">
                        <ListingCard listing={listing} />
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <Link href={`/edit-ad/${listing.id}`}>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="shadow-lg bg-white/90 hover:bg-white border border-border"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="shadow-lg"
                            onClick={() => handleDelete(listing.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 animate-fade-in">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Package className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">No listings yet</p>
                    <p className="text-center text-muted-foreground max-w-md">
                      Start your selling journey by posting your first ad and
                      reach thousands of potential buyers
                    </p>
                    <Link href="/post-ad">
                      <Button
                        size="lg"
                        className="mt-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Post Your First Ad
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card className="glass border-secondary/20">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-secondary/5 via-accent/5 to-primary/5 p-5">
                <h2 className="text-2xl font-bold">Saved Favorites</h2>
              </CardHeader>
              <CardContent className="p-6">
                {favorites.length === 0 ? (
                  <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 animate-fade-in">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                      <Heart className="h-12 w-12 text-secondary" />
                    </div>
                    <p className="text-2xl font-bold">No favorites yet</p>
                    <p className="text-center text-muted-foreground max-w-md">
                      Save items you&apos;re interested in to view and compare
                      them later
                    </p>
                    <Link href="/">
                      <Button
                        size="lg"
                        className="mt-4 bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 shadow-lg"
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        Browse Listings
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((l) => (
                      <div key={l.id} className="relative group">
                        <ListingCard listing={l} />
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="shadow-lg"
                            onClick={() => handleUnfavorite(l.id)}
                          >
                            <Heart className="h-4 w-4 mr-1 fill-current" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="glass border-accent/20">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-accent/5 via-primary/5 to-secondary/5 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Recent Conversations</h2>
                  <Link href="/chat">
                    <Button
                      variant="outline"
                      className="border-accent/30 hover:bg-accent/10"
                    >
                      View All in Chat
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {conversations.length === 0 ? (
                  <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 animate-fade-in">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                      <MessageSquare className="h-12 w-12 text-accent" />
                    </div>
                    <p className="text-2xl font-bold">No messages yet</p>
                    <p className="text-center text-muted-foreground max-w-md">
                      Your conversations with buyers and sellers will appear
                      here
                    </p>
                    <Link href="/chat">
                      <Button
                        size="lg"
                        className="mt-4 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-lg"
                      >
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Open Chat
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversations.map((c) => {
                      const other = c.receiver;
                      return (
                        <Card
                          key={c.id}
                          className="hover:shadow-lg transition-shadow border-border/50 hover:border-accent/30"
                        >
                          <CardContent className="p-5">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center flex-shrink-0">
                                  <User className="h-6 w-6 text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-lg truncate">
                                    {other?.name || "Conversation"}
                                  </div>
                                  <div className="text-sm text-muted-foreground truncate">
                                    {c.text || "No messages yet"}
                                  </div>
                                </div>
                              </div>
                              <Link
                                href={`/chat?conversation=${encodeURIComponent(
                                  c.id
                                )}`}
                              >
                                <Button className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Open
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
