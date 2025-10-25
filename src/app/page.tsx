"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CategorySidebar from "@/components/layout/CategorySidebar";
import ListingCard from "@/components/listing/ListingCard";
import ListingCardSkeleton from "@/components/listing/ListingCardSkeleton";
import { listingService } from "@/services/api";
import { useListingStore } from "@/stores/listingStore";
import { Listing } from "@/types";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

function HomePage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const { favorites, toggleFavorite } = useListingStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    category || "all"
  );

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const filters = selectedCategory !== "all" ? { category: selectedCategory } : {};
        const data = await listingService.getListings(filters);
        const listingsWithFavorites = data.map((listing) => ({
          ...listing,
          isFavorite: favorites.includes(listing.id),
        }));
        setListings(listingsWithFavorites);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [selectedCategory, favorites]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <CategorySidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Mobile Category Filter */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <h1 className="text-2xl font-bold">All Listings</h1>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Desktop Title */}
          <div className="mb-6 hidden lg:block">
            <h1 className="text-3xl font-bold">
              {selectedCategory === "all"
                ? "All Listings"
                : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace("-", " ")}`}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {loading ? "Loading..." : `${listings.length} items found`}
            </p>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ListingCardSkeleton key={i} />
                ))
              : listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onFavoriteToggle={toggleFavorite}
                  />
                ))}
          </div>

          {/* Empty State */}
          {!loading && listings.length === 0 && (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <p className="text-xl font-semibold">No listings found</p>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}

          {/* Load More */}
          {!loading && listings.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" size="lg">
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}

