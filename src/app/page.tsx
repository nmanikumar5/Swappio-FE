"use client";

import {
  useState,
  useEffect,
  Suspense,
  useCallback,
  useMemo,
  Fragment,
} from "react";
import { useSearchParams } from "next/navigation";
import CategoryBar from "@/components/layout/CategoryBar";
import ListingCard from "@/components/listing/ListingCard";
import ListingCardSkeleton from "@/components/listing/ListingCardSkeleton";
import { listingService } from "@/services/api";
import { useListingStore } from "@/stores/listingStore";
import { useLocationStore } from "@/stores/locationStore";
import { Listing, ListingFilters } from "@/types";
import { Button } from "@/components/ui/button";
import AdvancedFilters from "@/components/listing/AdvancedFilters";
import LeftSidebarFilters from "@/components/listing/LeftSidebarFilters";
import EmptyState from "@/components/EmptyState";
import { PageLoader } from "@/components/LoadingSpinner";
import AdSenseAd from "@/components/ads/AdSenseAd";
import LocationModal from "@/components/location/LocationModal";
import ViewOptions from "@/components/listing/ViewOptions";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import FilterDrawer from "@/components/ui/FilterDrawer";
import TrendingSection from "@/components/features/TrendingSection";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

function HomePage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const { favorites } = useListingStore();
  const {
    location: globalLocation,
    coords: globalCoords,
    hasValidLocation,
  } = useLocationStore();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    category || "all"
  );
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortOption, setSortOption] = useState("newest");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
  }>({});

  // Check if location is set, show modal if not
  useEffect(() => {
    if (!hasValidLocation()) {
      setShowLocationModal(true);
    }
  }, [hasValidLocation]);

  // fetch listings
  const fetchListings = useCallback(
    async (pageToLoad = 1) => {
      // Don't fetch if no location is set
      if (!hasValidLocation()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const apiFilters: ListingFilters = {};
        if (selectedCategory !== "all") apiFilters.category = selectedCategory;

        // Use global location from store
        if (globalLocation) {
          apiFilters.location = globalLocation;
        }

        // if coordinates are available, prefer them
        if (globalCoords) {
          apiFilters.lat = globalCoords.lat;
          apiFilters.lng = globalCoords.lng;
        }

        // Add advanced filters
        if (filters.search) apiFilters.search = filters.search;
        if (filters.minPrice) apiFilters.minPrice = filters.minPrice;
        if (filters.maxPrice) apiFilters.maxPrice = filters.maxPrice;
        if (filters.condition) apiFilters.condition = filters.condition;
        if (filters.sortBy) apiFilters.sortBy = filters.sortBy;
        if (filters.sortOrder) apiFilters.sortOrder = filters.sortOrder;

        // include pagination
        const result = await listingService.getListings({
          ...apiFilters,
          page: pageToLoad,
          limit: itemsPerPage,
        });
        const dataListings = result.listings || [];
        const listingsWithFavorites = dataListings.map((listing) => ({
          ...listing,
          isFavorite: favorites.includes(listing.id),
        }));

        if (pageToLoad === 1) {
          setListings(listingsWithFavorites);
        } else {
          setListings((prev) => [...prev, ...listingsWithFavorites]);
        }

        // pagination state
        const pagination = result.pagination;
        setPage(pagination?.page || pageToLoad);
        setHasMore(
          pagination
            ? pagination.page < pagination.pages
            : listingsWithFavorites.length >= 20
        );
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      selectedCategory,
      globalLocation,
      globalCoords,
      favorites,
      filters,
      hasValidLocation,
      itemsPerPage,
    ]
  );

  useEffect(() => {
    fetchListings(1);
  }, [
    selectedCategory,
    favorites,
    globalLocation,
    globalCoords,
    filters,
    fetchListings,
  ]);

  // Handle sort option change with debounce
  const handleSortChange = useCallback(
    (sort: string) => {
      setSortOption(sort);
      const newFilters = { ...filters };

      switch (sort) {
        case "newest":
          newFilters.sortBy = "createdAt";
          newFilters.sortOrder = "desc";
          break;
        case "oldest":
          newFilters.sortBy = "createdAt";
          newFilters.sortOrder = "asc";
          break;
        case "price-low":
          newFilters.sortBy = "price";
          newFilters.sortOrder = "asc";
          break;
        case "price-high":
          newFilters.sortBy = "price";
          newFilters.sortOrder = "desc";
          break;
        case "popular":
          newFilters.sortBy = "views";
          newFilters.sortOrder = "desc";
          break;
        default:
          delete newFilters.sortBy;
          delete newFilters.sortOrder;
      }

      setFilters(newFilters);
      setPage(1);
    },
    [filters]
  );

  // Load more handler with useCallback
  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    const next = page + 1;
    await fetchListings(next);
  }, [loading, hasMore, page, fetchListings]);

  // Handle filter changes with useCallback
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  // Handle filter reset with useCallback
  const handleFilterReset = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  // Handle search change with debounce (300ms)
  const handleSearchChange = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setFilters((prev) => ({ ...prev, search: value }));
        setPage(1);
      }, 300);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          onLocationSet={() => {
            setShowLocationModal(false);
            fetchListings(1);
          }}
        />
      )}

      {/* Horizontal Category Bar - Below Navbar */}
      <div className="sticky top-16 z-40 bg-background">
        <CategoryBar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          searchValue={filters.search || ""}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters ? (
        <AdvancedFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleFilterReset}
          isMobile
          onClose={() => setShowFilters(false)}
        />
      ) : null}

      {/* Main Container with Left Sidebar */}
      <div className="flex-1 relative">
        {/* Left Sidebar Filters */}
        <LeftSidebarFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleFilterReset}
          onCollapseChange={setSidebarCollapsed}
        />

        {/* 3-Column Grid: Left Ad | Content | Right Ad */}
        <div
          className={cn(
            "grid grid-cols-1 xl:grid-cols-[200px_1fr_200px] 2xl:grid-cols-[250px_1fr_250px] gap-0 transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "lg:ml-12" : "lg:ml-72"
          )}
        >
          {/* Left Ad Space - Desktop Only */}
          <div className="hidden xl:block border-r bg-muted/30 sticky top-[112px] h-[calc(100vh-112px)] overflow-y-auto">
            <div className="p-4 space-y-4">
              <AdSenseAd
                adSlot="LEFT-SIDEBAR-001"
                adFormat="vertical"
                fullWidthResponsive={false}
              />
              <AdSenseAd
                adSlot="LEFT-SIDEBAR-002"
                adFormat="rectangle"
                fullWidthResponsive={false}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Top Filters Section - Above Everything */}
            <div className="w-full bg-gradient-to-r from-background via-primary/5 to-secondary/5 border-b shadow-sm">
              <div className="px-4 py-2">
                {/* Desktop Title and Filters Row */}
                <div className="mb-3">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-1">
                    {selectedCategory === "all"
                      ? "All Listings"
                      : `${
                          selectedCategory.charAt(0).toUpperCase() +
                          selectedCategory.slice(1).replace("-", " ")
                        }`}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {loading ? "Loading..." : `${listings.length} items found`}
                    {globalLocation && (
                      <span className="ml-2">
                        near{" "}
                        <span className="font-medium text-primary">
                          {globalLocation}
                        </span>
                      </span>
                    )}
                  </p>
                </div>

                {/* Quick Filters Bar - Compact */}
                {/* <div className="flex flex-wrap items-center gap-2 bg-card/50 backdrop-blur-sm p-3 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Quick:
                    </span>
                    <Button
                      variant={
                        filters.condition === "new" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        setFilters({
                          ...filters,
                          condition:
                            filters.condition === "new" ? undefined : "new",
                        });
                        setPage(1);
                      }}
                      className="rounded-full h-8 px-3 text-xs"
                    >
                      ✨ New
                    </Button>
                    <Button
                      variant={
                        filters.condition === "like-new" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        setFilters({
                          ...filters,
                          condition:
                            filters.condition === "like-new"
                              ? undefined
                              : "like-new",
                        });
                        setPage(1);
                      }}
                      className="rounded-full h-8 px-3 text-xs"
                    >
                      ⭐ Like New
                    </Button>
                    <Button
                      variant={
                        filters.condition === "used" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        setFilters({
                          ...filters,
                          condition:
                            filters.condition === "used" ? undefined : "used",
                        });
                        setPage(1);
                      }}
                      className="rounded-full h-8 px-3 text-xs"
                    >
                      📦 Used
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(true)}
                      className="rounded-full h-8 px-3 text-xs border-2 hover:border-primary"
                    >
                      <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                      More
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilters({});
                        setPage(1);
                      }}
                      className="text-xs text-muted-foreground hover:text-primary h-8 px-3"
                    >
                      Clear
                    </Button>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Header Banner Ad - Compact */}
            <div className="w-full bg-muted/30 border-b">
              <div className="px-4 py-3">
                <AdSenseAd
                  adSlot="HEADER-BANNER-001"
                  adFormat="horizontal"
                  fullWidthResponsive={true}
                  className="mx-auto"
                />
              </div>
            </div>

            {/* View Options Bar */}
            <ViewOptions
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortOption}
              onSortChange={handleSortChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(items) => {
                setItemsPerPage(items);
                setPage(1);
              }}
              onFilterClick={() => setShowFilters(true)}
            />

            <div className="px-4 py-6">
              {/* Mobile Category Filter */}
              {/* <div className="mb-6 flex items-center justify-between lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                  className="w-full"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Adjust Filters & Sort
                </Button>
              </div> */}

              {/* Trending Section - Only on "all" category */}
              {selectedCategory === "all" && !loading && (
                <div className="mb-8">
                  <TrendingSection />

                  {/* Ad Unit - After Trending */}
                  {/* <div className="mt-6">
                    <AdSenseAd
                      adSlot="TRENDING-BOTTOM-001"
                      adFormat="horizontal"
                      fullWidthResponsive={true}
                    />
                  </div> */}
                </div>
              )}

              {/* Section Divider */}
              {selectedCategory === "all" && !loading && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">All Listings</h2>
                </div>
              )}

              {/* Listings Grid/List */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    : "flex flex-col gap-4"
                }
              >
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <ListingCardSkeleton key={i} />
                    ))
                  : listings.map((listing, index) => (
                      <Fragment
                        key={`${listing.id}-${
                          favorites.includes(listing.id) ? "fav" : "nofav"
                        }`}
                      >
                        <ListingCard listing={listing} />
                        {/* Ad Unit - Between Listings (every 6 items) */}
                        {(index + 1) % 6 === 0 && (
                          <div className="col-span-full my-4">
                            <AdSenseAd
                              adSlot="1122334455"
                              adFormat="horizontal"
                              fullWidthResponsive={true}
                            />
                          </div>
                        )}
                      </Fragment>
                    ))}
              </div>

              {/* Empty State */}
              {!loading && listings.length === 0 && (
                <EmptyState
                  title="No listings found"
                  description="Try adjusting your filters or location, or check back later for new items."
                  actionLabel="Clear Filters"
                  onAction={() => {
                    setFilters({});
                    setSelectedCategory("all");
                    setPage(1);
                  }}
                />
              )}

              {/* Load More */}
              {!loading && listings.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLoadMore}
                    disabled={!hasMore || loading}
                  >
                    {hasMore
                      ? loading
                        ? "Loading..."
                        : "Load More"
                      : "No more items"}
                  </Button>
                </div>
              )}

              {/* Bottom Ad Unit */}
              {!loading && listings.length > 0 && (
                <div className="mt-8">
                  <AdSenseAd
                    adSlot="BOTTOM-AD-001"
                    adFormat="horizontal"
                    fullWidthResponsive={true}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Ad Space - Desktop Only */}
          <div className="hidden xl:block border-l bg-muted/30 sticky top-[112px] h-[calc(100vh-112px)] overflow-y-auto">
            <div className="p-4 space-y-4">
              <AdSenseAd
                adSlot="RIGHT-SIDEBAR-001"
                adFormat="vertical"
                fullWidthResponsive={false}
              />
              <AdSenseAd
                adSlot="RIGHT-SIDEBAR-002"
                adFormat="rectangle"
                fullWidthResponsive={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onFilterClick={() => setShowFilters(true)}
        onSearchClick={() => {
          // Focus on search input or open search modal
          const searchInput = document.querySelector('input[type="search"]');
          if (searchInput) {
            (searchInput as HTMLInputElement).focus();
          }
        }}
      />

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<PageLoader text="Loading Swappio..." />}>
      <HomePage />
    </Suspense>
  );
}
