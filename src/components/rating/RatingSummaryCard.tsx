"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StarRating from "./StarRating";
import { ratingService } from "@/services/api";
import { RatingSummary } from "@/types";
import { Star } from "lucide-react";

interface RatingSummaryCardProps {
  userId: string;
  compact?: boolean;
}

export default function RatingSummaryCard({
  userId,
  compact = false,
}: RatingSummaryCardProps) {
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ratingService.getUserRatingSummary(userId);
      setSummary(data);
    } catch (error) {
      console.error("Error fetching rating summary:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading) {
    return (
      <Card className={compact ? "" : "gradient-border"}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-8 w-24 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary || summary.totalRatings === 0) {
    if (compact) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="h-4 w-4" />
          <span>No ratings yet</span>
        </div>
      );
    }

    return (
      <Card className="gradient-border">
        <CardContent className="p-6 text-center">
          <Star className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No ratings yet</p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <StarRating rating={summary.averageRating} size="sm" showNumber />
        <span className="text-sm text-muted-foreground">
          ({summary.totalRatings}{" "}
          {summary.totalRatings === 1 ? "rating" : "ratings"})
        </span>
      </div>
    );
  }

  return (
    <Card className="gradient-border">
      <CardHeader>
        <CardTitle className="text-lg">User Rating</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Average Rating */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">
              {summary.averageRating.toFixed(1)}
            </div>
            <div className="mt-1">
              <StarRating rating={summary.averageRating} size="md" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {summary.totalRatings}{" "}
              {summary.totalRatings === 1 ? "rating" : "ratings"}
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count =
                summary.ratingBreakdown[
                  stars as keyof typeof summary.ratingBreakdown
                ];
              const percentage =
                summary.totalRatings > 0
                  ? (count / summary.totalRatings) * 100
                  : 0;

              return (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-muted-foreground">{stars}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
