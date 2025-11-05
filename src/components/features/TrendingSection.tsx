"use client";

import { useEffect, useState } from "react";
import { Listing } from "@/types";
import ListingCard from "@/components/listing/ListingCard";
import { listingService } from "@/services/api";
import { TrendingUp, Flame, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TrendingSection() {
  const [trending, setTrending] = useState<Listing[]>([]);
  const [hotDeals, setHotDeals] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      // Fetch trending (most viewed in last 7 days)
      const trendingResult = await listingService.getListings({
        sortBy: "views",
        sortOrder: "desc",
        limit: 6,
      });

      // Fetch hot deals (lowest price, high value items)
      const dealsResult = await listingService.getListings({
        sortBy: "price",
        sortOrder: "asc",
        limit: 6,
      });

      setTrending(trendingResult.listings || []);
      setHotDeals(dealsResult.listings || []);
    } catch (error) {
      console.error("Failed to fetch trending:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-muted animate-pulse rounded-lg" />
        <div className="h-48 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Trending Listings */}
      {trending.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Trending Now
                <Badge variant="secondary" className="bg-orange-500 text-white">
                  <Flame className="h-3 w-3 mr-1" />
                  Hot
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground">
                Most viewed items this week
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.slice(0, 3).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </Card>
      )}

      {/* Hot Deals */}
      {/* {hotDeals.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Hot Deals
                <Badge
                  variant="secondary"
                  className="bg-emerald-500 text-white"
                >
                  Best Value
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground">
                Great prices on quality items
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotDeals.slice(0, 3).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </Card>
      )} */}
    </div>
  );
}
