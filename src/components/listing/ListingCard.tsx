"use client";

import Image from "next/image";
import { useState, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { Listing } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye, Heart, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { favoriteService } from "@/services/api";
import { useListingStore } from "@/stores/listingStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

interface ListingCardProps {
  listing: Listing;
  onFavoriteToggle?: (id: string) => void;
  // supplied by wrapper when memoized
  isFavoriteFromStore?: boolean;
}

function ListingCardInner({
  listing,
  onFavoriteToggle,
  isFavoriteFromStore,
}: ListingCardProps) {
  const router = useRouter();
  const [isFavoriting, setIsFavoriting] = useState(false);
  const toggleFavorite = useListingStore((s) => s.toggleFavorite);
  const setListingInStore = useListingStore((s) => s.setListing);
  const user = useAuthStore((s) => s.user);

  // Prefer the supplied favorite boolean (from wrapper subscription)
  const isFavorite =
    typeof isFavoriteFromStore === "boolean" ? isFavoriteFromStore : false;

  // Compute an instant, optimistic favoriteCount for UI based on change vs. prop
  const baseFavoriteFromProps = listing.isFavorite ?? false;
  const displayedFavoriteCount = Math.max(
    0,
    (listing.favoriteCount ?? 0) +
      (isFavorite ? 1 : 0) -
      (baseFavoriteFromProps ? 1 : 0)
  );

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Favorite button clicked");

    // Check if user is authenticated
    if (!user) {
      toast.error("Please sign in to save favorites");
      router.push("/auth/signin");
      return;
    }

    setIsFavoriting(true);
    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(listing.id);
        toast.success("Removed from favorites");
      } else {
        await favoriteService.addFavorite(listing.id);
        toast.success("Added to favorites");
      }
      // Update local state
      toggleFavorite(listing.id);
      // Update cached listing in store so UI reflects changes immediately
      try {
        const updated = {
          ...listing,
          isFavorite: !isFavorite,
          favoriteCount: (listing.favoriteCount || 0) + (isFavorite ? -1 : 1),
        } as typeof listing;
        setListingInStore(updated);
      } catch (e) {
        console.warn("Failed to update listing cache", e);
      }
      onFavoriteToggle?.(listing.id);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update favorite. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsFavoriting(false);
    }
  };

  // Check if listing is new (within last 3 days) - memoized
  const isNew = useMemo(() => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(listing.createdAt) > threeDaysAgo;
  }, [listing.createdAt]);

  // Get primary image - memoized
  const primaryImage = useMemo(() => {
    return listing.images && listing.images.length > 0
      ? listing.images[0]
      : "/placeholder.png";
  }, [listing.images]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Allow click through if clicking on the favorite button
    const target = e.target as HTMLElement;
    if (target.closest("button[data-favorite-btn]")) {
      e.preventDefault();
      return;
    }
    router.push(`/listing/${listing.id}`);
  };

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-border/50 hover:border-primary/50 bg-card relative">
        <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          {primaryImage !== "/placeholder.png" ? (
            <Image
              src={primaryImage}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}

          {/* Favorite Button with better styling */}
          <Button
            size="icon"
            variant="secondary"
            data-favorite-btn
            className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-md bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
            onClick={(e: React.MouseEvent) => {
              // Prevent card navigation
              e.preventDefault();
              e.stopPropagation();
              void handleFavoriteClick(e);
            }}
            disabled={isFavoriting}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </Button>

          {/* Multiple Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1.5">
            {/* Status Badge */}
            {listing.status !== "active" && (
              <Badge
                className={`font-semibold shadow-md text-xs ${
                  listing.status === "sold" ? "bg-red-500" : "bg-amber-500"
                } text-white border-0`}
              >
                {listing.status.toUpperCase()}
              </Badge>
            )}

            {/* New Badge */}
            {isNew && listing.status === "active" && (
              <Badge className="font-semibold shadow-md bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 flex items-center gap-1 text-xs">
                <Sparkles className="h-3 w-3" />
                NEW
              </Badge>
            )}
          </div>

          {/* Favorite Count Badge */}
          {displayedFavoriteCount > 0 && (
            <div className="absolute left-2 bottom-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
              <Heart className="h-3.5 w-3.5 fill-white" />
              {displayedFavoriteCount}
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-3 space-y-2">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize font-medium">
              {listing.category}
            </Badge>
          </div>

          <h3 className="line-clamp-2 font-semibold text-sm sm:text-base group-hover:text-primary transition-colors min-h-[2.5rem]">
            {listing.title}
          </h3>

          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {formatPrice(listing.price)}
          </p>

          <div className="flex items-center gap-1.5 text-xs sm:text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 text-primary/60" />
            <span className="truncate text-xs">{listing.location}</span>
          </div>

          {/* Owner Info */}
          {listing.ownerId && (
            <div className="flex items-center gap-1.5 pt-1.5 border-t border-border/50">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {listing.ownerId.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground truncate">
                {listing.ownerId.name || "User"}
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/50 px-3 py-2 text-xs text-muted-foreground bg-muted/20">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-primary/60" />
            <span className="text-primary/80 font-medium">
              {formatDate(listing.createdAt)}
            </span>
          </span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
            <Eye className="h-3 w-3 text-primary" />
            <span className="font-medium text-primary">
              {listing.views || 0}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Memoize the inner component with a custom comparator that also watches the "isFavoriteFromStore" prop
const MemoizedListingCard = memo(
  ListingCardInner,
  (prevProps: ListingCardProps, nextProps: ListingCardProps) => {
    return (
      prevProps.listing.id === nextProps.listing.id &&
      prevProps.listing.views === nextProps.listing.views &&
      prevProps.isFavoriteFromStore === nextProps.isFavoriteFromStore
    );
  }
);

// Wrapper subscribes to only the favorites boolean for this listing id, keeping re-renders minimal
export default function ListingCard(
  props: Omit<ListingCardProps, "isFavoriteFromStore">
) {
  const isFav = useListingStore((s) => s.favorites.includes(props.listing.id));
  return <MemoizedListingCard {...props} isFavoriteFromStore={isFav} />;
}
