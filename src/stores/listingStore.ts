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
}

export const useListingStore = create<ListingState>((set) => ({
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
}));
