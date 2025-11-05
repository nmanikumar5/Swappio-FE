import { create } from "zustand";
import { Listing, ListingFilters } from "@/types";

interface ListingState {
  listings: Listing[];
  filters: ListingFilters;
  favorites: string[];
  setListings: (listings: Listing[]) => void;
  setFilters: (filters: ListingFilters) => void;
  addFavorite: (listingId: string) => void;
  removeFavorite: (listingId: string) => void;
  toggleFavorite: (listingId: string) => void;
  // caching helpers
  getListingFromCache: (id: string) => Listing | undefined;
  setListing: (listing: Listing) => void;
  ensureListing: (id: string) => Promise<Listing | null>;
}

export const useListingStore = create<ListingState>((set, get) => ({
  listings: [],
  filters: {},
  favorites: [],
  setListings: (listings) => set({ listings }),
  setFilters: (filters) => set({ filters }),
  addFavorite: (listingId) =>
    set((state) => ({
      favorites: [...state.favorites, listingId],
    })),
  removeFavorite: (listingId) =>
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== listingId),
    })),
  toggleFavorite: (listingId) =>
    set((state) => ({
      favorites: state.favorites.includes(listingId)
        ? state.favorites.filter((id) => id !== listingId)
        : [...state.favorites, listingId],
    })),
  getListingFromCache: (id: string) => {
    const s = get();
    return s.listings.find((l: Listing) => l.id === id);
  },
  setListing: (listing: Listing) =>
    set((state) => ({
      listings: state.listings.some((l) => l.id === listing.id)
        ? state.listings.map((l) => (l.id === listing.id ? listing : l))
        : [...state.listings, listing],
    })),
  ensureListing: async (id: string) => {
    const s = get();
    const cached = s.listings.find((l: Listing) => l.id === id);
    if (cached) return cached;
    try {
      // import lazily to avoid circular deps at module import time
      const api = await import("@/services/api");
      const listing = await api.listingService.getListing(id);
      if (listing) {
        set((state) => ({
          listings: [...state.listings, listing],
        }));
        return listing;
      }
      return null;
    } catch (e) {
      console.warn("ensureListing failed", e);
      return null;
    }
  },
}));
