"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { listingService } from "@/services/api";
import { Listing } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  MapPin,
  Eye,
  Heart,
  Share2,
  Flag,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await listingService.getListing(params.id as string);
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  const nextImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-video w-full" />
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="mb-4 h-8 w-2/3" />
                <Skeleton className="mb-6 h-12 w-1/2" />
                <Skeleton className="mb-4 h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <p className="text-xl font-semibold">Listing not found</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Images and Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Image Carousel */}
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
              {listing.images && listing.images.length > 0 ? (
                <>
                  <Image
                    src={listing.images[currentImageIndex]}
                    alt={listing.title}
                    fill
                    className="object-contain"
                  />
                  {listing.images.length > 1 && (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute left-2 top-1/2 -translate-y-1/2"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <Badge variant="secondary">
                          {currentImageIndex + 1} / {listing.images.length}
                        </Badge>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-muted-foreground">No images</span>
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            {listing.images && listing.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2 p-4">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                      currentImageIndex === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Description</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {listing.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price and Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(listing.price)}
                </p>
              </div>

              <h1 className="mb-4 text-2xl font-semibold">{listing.title}</h1>

              <div className="mb-6 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{listing.views} views</span>
                </div>
                <div>Posted on {formatDate(listing.createdAt)}</div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with Seller
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Heart className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                <Button variant="ghost" className="w-full text-destructive">
                  <Flag className="mr-2 h-4 w-4" />
                  Report this ad
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">Seller Information</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{listing.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Member since {formatDate(listing.user.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
