"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import StarRating from "./StarRating";
import { ratingService } from "@/services/api";
import { Rating } from "@/types";
import { PageLoader } from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UserRatingsProps {
  userId: string;
  type?: "buyer" | "seller";
  limit?: number;
}

export default function UserRatings({
  userId,
  type,
  limit = 10,
}: UserRatingsProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRatings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ratingService.getUserRatings(userId, {
        page,
        limit,
        type,
      });
      setRatings(data.ratings);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, type, page, limit]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  if (loading && page === 1) {
    return <PageLoader text="Loading ratings..." />;
  }

  if (!loading && ratings.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="No ratings yet"
        description={`This user hasn't received any ratings as a ${
          type || "user"
        } yet.`}
      />
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <Card key={rating.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex gap-3">
              {/* Reviewer Avatar */}
              <Avatar className="h-10 w-10">
                {rating.reviewer.photo ? (
                  <Image
                    src={rating.reviewer.photo}
                    alt={rating.reviewer.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-secondary">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </Avatar>

              {/* Rating Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{rating.reviewer.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={rating.rating} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {rating.type === "buyer" ? "As Buyer" : "As Seller"}
                  </span>
                </div>

                {rating.review && (
                  <p className="text-sm text-gray-700 mt-2">{rating.review}</p>
                )}

                {rating.listing && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Related to:{" "}
                    <span className="font-medium">{rating.listing.title}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Load More */}
      {totalPages > page && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
