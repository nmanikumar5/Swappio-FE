"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useListingStore } from "@/stores/listingStore";
import { favoriteService } from "@/services/api";

export default function FavoritesHydrator() {
  const user = useAuthStore((s) => s.user);
  const setListings = useListingStore((s) => s.setListings);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        // Clear favorites if not authenticated
        useListingStore.setState({ favorites: [] });
        return;
      }

      try {
        const favoriteListings = await favoriteService.getFavorites();
        // Extract just the IDs
        const favoriteIds = favoriteListings.map((listing) => listing.id);
        // Update the favorites array in the store
        useListingStore.setState({ favorites: favoriteIds });
        // Also update the listings cache
        setListings(favoriteListings);
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };

    loadFavorites();
  }, [user, setListings]);

  return null; // This component doesn't render anything
}
