"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { favoriteService } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  listingId: string;
  isFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  className?: string;
}

export default function FavoriteButton({
  listingId,
  isFavorite = false,
  onToggle,
  className = "",
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);
    try {
      if (favorited) {
        await favoriteService.removeFavorite(listingId);
        setFavorited(false);
        onToggle?.(false);
      } else {
        await favoriteService.addFavorite(listingId);
        setFavorited(true);
        onToggle?.(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`rounded-full bg-white/90 p-2 transition-all hover:bg-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          favorited
            ? "fill-red-500 text-red-500"
            : "text-gray-600 hover:text-red-500"
        }`}
      />
    </button>
  );
}
