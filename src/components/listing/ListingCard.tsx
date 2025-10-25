"use client";

import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListingCardProps {
  listing: Listing;
  onFavoriteToggle?: (id: string) => void;
}

export default function ListingCard({
  listing,
  onFavoriteToggle,
}: ListingCardProps) {
  return (
    <Link href={`/listing/${listing.id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {listing.images && listing.images.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}

          <Button
            size="icon"
            variant="secondary"
            className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              onFavoriteToggle?.(listing.id);
            }}
          >
            <Heart
              className={`h-4 w-4 ${
                listing.isFavorite ? "fill-current text-red-500" : ""
              }`}
            />
          </Button>

          {listing.status !== "active" && (
            <Badge className="absolute left-2 top-2" variant="secondary">
              {listing.status}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-2 font-semibold">{listing.title}</h3>
          <p className="mb-2 text-xl font-bold text-primary">
            {formatPrice(listing.price)}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{listing.location}</span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t p-4 text-xs text-muted-foreground">
          <span>{formatDate(listing.createdAt)}</span>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{listing.views}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
