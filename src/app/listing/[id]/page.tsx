"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { messageService, favoriteService } from "@/services/api";
import { useListingStore } from "@/stores/listingStore";
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
  Phone,
  Mail,
  Calendar,
  Tag,
  Package,
  Shield,
  TrendingUp,
  Clock,
} from "lucide-react";
import ShareModal from "@/components/ShareModal";
import ReportModal from "@/components/ReportModal";
import { toast } from "sonner";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const toggleFavorite = useListingStore((s) => s.toggleFavorite);
  const favorites = useListingStore((s) => s.favorites);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const ensureListing = useListingStore.getState().ensureListing;
        const data = await ensureListing(params.id as string);
        if (data) {
          // Check if this listing is in favorites
          const isFav = favorites.includes(data.id);
          setListing({ ...data, isFavorite: isFav });
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id, favorites]);

  const nextImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Chat store selectors
  const conversations = useChatStore((s) => s.conversations);
  const setConversations = useChatStore((s) => s.setConversations);
  const setCurrentConversation = useChatStore((s) => s.setCurrentConversation);
  const setMessages = useChatStore((s) => s.setMessages);
  const authUser = useAuthStore((s) => s.user);

  const startChatWithSeller = async () => {
    if (!listing) return;

    // Check if user is authenticated
    if (!authUser) {
      toast.error("Please sign in to chat with seller");
      router.push("/auth/signin");
      return;
    }

    // Require seller info
    const sellerId = listing.user?.id || listing.ownerId?._id;
    const sellerName = listing.user?.name || listing.ownerId?.name;

    if (!sellerId) {
      toast.error("Seller information not available");
      return;
    }

    // Prevent chatting with self
    if (authUser && sellerId === authUser.id) {
      toast.warning("This is your own listing");
      return;
    }

    try {
      // See if a conversation already exists for this listing + seller
      const existing = conversations.find(
        (c) => c.receiver?.name === sellerName || c.receiver?._id === sellerId
      );

      if (existing) {
        // Reuse existing conversation - just navigate to chat
        setCurrentConversation(existing);
        toast.success("Opening chat");
        router.push("/chat");
        return;
      }

      // Send initial message to backend
      const text = `Hi ${sellerName}, is "${listing.title}" still available?`;

      const sent = await messageService.sendMessage({
        receiverId: sellerId,
        text,
        listingId: listing.id,
      });

      // Get updated conversations
      const updatedConvs = await messageService.getConversations();
      setConversations(updatedConvs);

      if (updatedConvs.length > 0) {
        // Find the conversation we just created (it will be the most recent)
        const newConv =
          updatedConvs.find((c) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const conv = c as any;
            return (
              conv.receiver?._id === sellerId || conv.sender?._id === sellerId
            );
          }) || updatedConvs[0];

        setCurrentConversation(newConv);

        if (sent) {
          setMessages([sent]);
        } else {
          setMessages([]);
        }

        toast.success("Chat started successfully");
        router.push("/chat");
      } else {
        toast.error("Failed to start conversation");
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start chat";
      toast.error(errorMessage);
    }
  };

  const prevImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };

  const handleFavoriteToggle = async () => {
    if (!listing) return;

    // Check if user is authenticated
    if (!authUser) {
      toast.error("Please sign in to save favorites");
      router.push("/auth/signin");
      return;
    }

    setIsFavoriting(true);
    try {
      const currentIsFavorite = listing.isFavorite;
      if (currentIsFavorite) {
        await favoriteService.removeFavorite(listing.id);
        toast.success("Removed from favorites");
      } else {
        await favoriteService.addFavorite(listing.id);
        toast.success("Added to favorites");
      }
      // Update global store
      toggleFavorite(listing.id);
      // Update local listing state
      setListing({ ...listing, isFavorite: !currentIsFavorite });
    } catch (error: unknown) {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-8">
      {/* Hero Section with Breadcrumb */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-10">
        <div className="container mx-auto max-w-7xl px-4 py-3 md:py-4">
          <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button
              onClick={() => router.push("/")}
              className="hover:text-primary transition-colors flex-shrink-0"
            >
              Home
            </button>
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <button
              onClick={() => router.push(`/?category=${listing.category}`)}
              className="hover:text-primary transition-colors flex-shrink-0"
            >
              {listing.category}
            </button>
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span className="text-foreground font-medium line-clamp-1">
              {listing.title}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-2 sm:px-4 py-4 md:py-8">
        <div className="grid gap-4 md:gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Main Content - Left Side */}
          <div className="space-y-4 md:space-y-6 lg:col-span-2">
            {/* Image Carousel with Modern Design */}
            <Card className="overflow-hidden border-2 shadow-xl">
              <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <Image
                      src={listing.images[currentImageIndex]}
                      alt={listing.title}
                      fill
                      className="object-contain"
                      priority
                    />
                    {/* Image Navigation */}
                    {listing.images.length > 1 && (
                      <>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 shadow-lg hover:scale-110 transition-transform"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 shadow-lg hover:scale-110 transition-transform"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2">
                          <Badge
                            variant="secondary"
                            className="shadow-lg backdrop-blur-sm bg-background/80 text-xs md:text-sm"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            {currentImageIndex + 1} / {listing.images.length}
                          </Badge>
                        </div>
                      </>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-2 md:top-4 right-2 md:right-4">
                      <Badge
                        className="shadow-lg text-xs md:text-sm"
                        variant={
                          listing.status === "active" ? "default" : "secondary"
                        }
                      >
                        {listing.status.toUpperCase()}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-16 w-16 md:h-20 md:w-20 text-muted-foreground/20" />
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {listing.images && listing.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 md:gap-2 p-2 md:p-4 bg-muted/30">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square overflow-hidden rounded-md md:rounded-lg border-2 transition-all hover:scale-105 ${
                        currentImageIndex === index
                          ? "border-primary shadow-md ring-2 ring-primary/20"
                          : "border-transparent hover:border-muted-foreground/30"
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

            {/* Product Details Card */}
            <Card className="border-2 shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4 md:space-y-6">
                  {/* Title and Category */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                        {listing.title}
                      </h1>
                      <Badge
                        variant="outline"
                        className="whitespace-nowrap self-start sm:self-auto"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {listing.category}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                        <span className="truncate">{listing.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                        <span>{listing.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                        <span className="hidden sm:inline">
                          Posted {formatDate(listing.createdAt)}
                        </span>
                        <span className="sm:hidden">
                          {formatDate(listing.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Section - Highlighted */}
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 md:p-6 rounded-xl border-l-4 border-primary">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                      <span className="text-3xl md:text-4xl font-bold text-primary">
                        {formatPrice(listing.price)}
                      </span>
                      <Badge
                        variant="secondary"
                        className="mb-1 self-start sm:self-auto"
                      >
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Best Offer
                      </Badge>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-2">
                      Negotiable • Safe Transaction • Meet in Public Place
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      Description
                    </h2>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-sm md:text-base text-muted-foreground leading-relaxed">
                        {listing.description}
                      </p>
                    </div>
                  </div>

                  {/* Safety Tips */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 md:p-4 rounded-lg border border-blue-200 dark:border-blue-900">
                    <h3 className="font-semibold text-sm md:text-base text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Safety Tips
                    </h3>
                    <ul className="text-xs md:text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Meet in a public place</li>
                      <li>• Check the item before payment</li>
                      <li>• Pay only after collecting the item</li>
                      <li>• Don&apos;t share personal banking details</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AdSense Section - Hidden on mobile */}
            <Card className="border-2 bg-muted/30 hidden md:block">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-3">
                    Advertisement
                  </p>
                  {/* Google AdSense Placeholder */}
                  <div className="bg-gradient-to-r from-muted-foreground/5 to-muted-foreground/10 min-h-[200px] flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20">
                    <div className="text-center space-y-2">
                      <TrendingUp className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Advertisement Space
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        Google AdSense will appear here
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-4 md:space-y-6">
            {/* Action Card */}
            <Card className="sticky top-[88px] border-2 shadow-xl">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {/* Primary CTA */}
                  <Button
                    className="w-full h-11 md:h-12 text-base md:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    size="lg"
                    onClick={startChatWithSeller}
                    disabled={!!authUser && listing.user?.id === authUser.id}
                  >
                    <MessageSquare className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    {authUser && listing.user?.id === authUser.id
                      ? "Your Listing"
                      : "Chat with Seller"}
                  </Button>

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="h-10 md:h-11 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-sm md:text-base"
                      onClick={handleFavoriteToggle}
                      disabled={isFavoriting}
                    >
                      <Heart
                        className={`mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 transition-all ${
                          listing.isFavorite
                            ? "fill-red-500 text-red-500 scale-110"
                            : "hover:scale-110"
                        }`}
                      />
                      <span className="hidden sm:inline">
                        {listing.isFavorite ? "Saved" : "Save"}
                      </span>
                      <span className="sm:hidden">♥</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 md:h-11 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors text-sm md:text-base"
                      onClick={() => setIsShareModalOpen(true)}
                    >
                      <Share2 className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      Share
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:bg-destructive/10 h-10 md:h-11 text-sm md:text-base"
                    onClick={() => {
                      if (!authUser) {
                        toast.error("Please sign in to report this ad");
                        router.push("/auth/signin");
                        return;
                      }
                      setIsReportModalOpen(true);
                    }}
                  >
                    <Flag className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                    Report this ad
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info Card */}
            <Card className="border-2 shadow-lg">
              <CardContent className="p-4 md:p-6">
                <h3 className="font-semibold text-sm md:text-base mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Seller Information
                </h3>
                <div className="space-y-3 md:space-y-4">
                  {/* Seller Profile */}
                  <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-lg border">
                    <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg flex-shrink-0">
                      {listing.user?.photo || listing.user?.image ? (
                        <Image
                          src={listing.user.photo || listing.user.image || ""}
                          alt={listing.user.name || "Seller"}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 md:h-8 md:w-8" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base md:text-lg truncate">
                        {listing.user?.name ||
                          listing.ownerId?.name ||
                          "Unknown seller"}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {listing.user?.createdAt || listing.createdAt
                            ? `Member since ${formatDate(
                                listing.user?.createdAt || listing.createdAt
                              )}`
                            : "Member info unavailable"}
                        </span>
                      </p>
                      {listing.user?.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {listing.user.location}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Seller Stats */}
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <div className="text-center p-2 md:p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl md:text-2xl font-bold text-primary">
                        {listing.user?.averageRating?.toFixed(1) || "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Rating
                      </div>
                    </div>
                    <div className="text-center p-2 md:p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl md:text-2xl font-bold text-primary">
                        {listing.user?.totalRatings || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Reviews
                      </div>
                    </div>
                  </div>

                  {/* Contact Options */}
                  {listing.user?.phone && (
                    <div className="space-y-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-sm md:text-base h-9 md:h-10"
                        size="sm"
                        onClick={() => {
                          if (listing.user?.phone) {
                            window.location.href = `tel:${listing.user.phone}`;
                          }
                        }}
                      >
                        <Phone className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                        {listing.user.phone}
                      </Button>
                    </div>
                  )}
                  {listing.user?.email && (
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm md:text-base h-9 md:h-10"
                      size="sm"
                      onClick={() => {
                        if (listing.user?.email) {
                          window.location.href = `mailto:${listing.user.email}`;
                        }
                      }}
                    >
                      <Mail className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      Send Email
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="border-2 shadow-lg">
              <CardContent className="p-4 md:p-6">
                <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Location
                </h3>
                <div className="space-y-3">
                  <div className="p-3 md:p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm md:text-base">
                      {listing.location}
                    </p>
                  </div>
                  {/* Map Placeholder */}
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                    <div className="text-center">
                      <MapPin className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Map View
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        title={listing.title}
        description={listing.description}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        listingId={listing.id}
        listingTitle={listing.title}
      />
    </div>
  );
}
