"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";
import { ratingService } from "@/services/api";
import { showToast } from "@/components/ui/toast";
import { ButtonLoader } from "@/components/LoadingSpinner";

interface RatingFormProps {
  revieweeId: string;
  revieweeName: string;
  listingId?: string;
  type: "buyer" | "seller";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RatingForm({
  revieweeId,
  revieweeName,
  listingId,
  type,
  onSuccess,
  onCancel,
}: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      showToast({ type: "error", title: "Please select a rating" });
      return;
    }

    try {
      setSubmitting(true);
      await ratingService.createRating({
        revieweeId,
        listingId,
        rating,
        review: review.trim() || undefined,
        type,
      });

      showToast({ type: "success", title: "Rating submitted successfully!" });
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      console.error("Error submitting rating:", error);
      const message =
        error instanceof Error ? error.message : "Failed to submit rating";
      showToast({ type: "error", title: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md gradient-border">
      <CardHeader>
        <CardTitle>
          Rate {revieweeName} as a {type}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating *</label>
            <div className="flex justify-center py-2">
              <StarRating
                rating={rating}
                size="lg"
                interactive
                onRatingChange={setRating}
              />
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Review (Optional)</label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder={`Share your experience with ${revieweeName}...`}
              maxLength={500}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {review.length}/500
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={submitting}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={submitting || rating === 0}
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
            >
              {submitting ? <ButtonLoader /> : "Submit Rating"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
