"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Listing } from "@/types";
import { favoriteService } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { PageLoader } from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import AdSenseAd from "@/components/ads/AdSenseAd";

type SortOption = "recent" | "price-low" | "price-high";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [deleting, setDeleting] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch favorites from the backend API
      const data = await favoriteService.getFavorites();

      // Backend returns listings directly after getFavorites processes the response
      setFavorites(data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to load favorites. Please try again.");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (listingId: string) => {
    try {
      setDeleting(listingId);
      await favoriteService.removeFavorite(listingId);
      setFavorites((prev) => prev.filter((fav) => fav.id !== listingId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError("Failed to remove favorite. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const getSortedFavorites = () => {
    const sorted = [...favorites];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "recent":
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const sortedFavorites = getSortedFavorites();

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <EmptyState
          icon={Heart}
          title="Sign in to view favorites"
          description="You need to be signed in to save and view your favorite listings"
          actionLabel="Sign In"
          onAction={() => (window.location.href = "/auth/signin")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header Banner Ad */}
        <div className="mb-6">
          <AdSenseAd
            adSlot="FAVORITES-HEADER-001"
            adFormat="horizontal"
            fullWidthResponsive={true}
          />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              My Favorites
            </h1>
            <p className="mt-2 text-muted-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-secondary" />
              {favorites.length} item{favorites.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          {favorites.length > 0 && (
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-xl border-2 border-border/50 bg-card px-4 py-2 text-sm font-medium shadow-sm hover:border-primary/30 transition-all focus:ring-2 focus:ring-primary/20"
              >
                <option value="recent">Most Recent</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>

        {error && (
          <Card className="mb-6 border-2 border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-4">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <PageLoader text="Loading your favorites..." />
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Save items you like by clicking the heart icon on listings"
            actionLabel="Browse Listings"
            onAction={() => (window.location.href = "/")}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedFavorites.map((listing, index) => (
              <>
                <Card
                  key={listing.id}
                  className="group overflow-hidden border-2 shadow-md hover:shadow-2xl hover:border-primary/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50">
                    {listing.images?.[0] ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <Heart className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveFavorite(listing.id)}
                      disabled={deleting === listing.id}
                      className="absolute right-3 top-3 rounded-full bg-white/90 backdrop-blur-sm p-2.5 hover:bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 disabled:opacity-50"
                      title="Remove from favorites"
                    >
                      {deleting === listing.id ? (
                        <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-600" />
                      )}
                    </button>
                    {/* Favorite indicator */}
                    <div className="absolute left-3 top-3">
                      <div className="rounded-full bg-red-500/90 backdrop-blur-sm p-2 shadow-lg">
                        <Heart className="h-4 w-4 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <Link href={`/listing/${listing.id}`} className="block">
                      <h3 className="font-bold text-lg line-clamp-2 hover:text-primary transition-colors">
                        {listing.title}
                      </h3>
                    </Link>

                    <div className="mt-3 bg-gradient-to-r from-primary/10 to-transparent p-3 rounded-lg border-l-4 border-primary">
                      <p className="text-2xl font-bold text-primary">
                        ₹{listing.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{listing.location}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-muted rounded-md font-medium">
                        {listing.category}
                      </span>
                      <span>
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link
                      href={`/listing/${listing.id}`}
                      className="mt-4 block"
                    >
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-md hover:shadow-lg transition-all">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Ad Unit every 6 items */}
                {(index + 1) % 6 === 0 && (
                  <div className="col-span-full">
                    <AdSenseAd
                      adSlot="FAVORITES-INFEED-001"
                      adFormat="horizontal"
                      fullWidthResponsive={true}
                    />
                  </div>
                )}
              </>
            ))}
          </div>
        )}

        {/* Bottom Ad */}
        {!loading && favorites.length > 0 && (
          <div className="mt-8">
            <AdSenseAd
              adSlot="FAVORITES-BOTTOM-001"
              adFormat="horizontal"
              fullWidthResponsive={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
