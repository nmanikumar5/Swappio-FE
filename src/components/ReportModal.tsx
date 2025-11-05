"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Flag } from "lucide-react";
import { reportService } from "@/services/api";
import { toast } from "sonner";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}

const REPORT_REASONS = [
  {
    value: "spam",
    label: "Spam or Misleading",
    description: "Fake listings or scams",
  },
  {
    value: "inappropriate",
    label: "Inappropriate Content",
    description: "Offensive or adult content",
  },
  {
    value: "duplicate",
    label: "Duplicate Listing",
    description: "Same item posted multiple times",
  },
  {
    value: "sold",
    label: "Already Sold",
    description: "Item is no longer available",
  },
  {
    value: "prohibited",
    label: "Prohibited Item",
    description: "Item not allowed on platform",
  },
  {
    value: "wrong-category",
    label: "Wrong Category",
    description: "Listed in incorrect category",
  },
  { value: "other", label: "Other", description: "Other issues" },
];

export default function ReportModal({
  isOpen,
  onClose,
  listingId,
  listingTitle,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    setIsSubmitting(true);
    try {
      await reportService.createReport({
        listingId,
        reason: selectedReason,
        description: description.trim() || undefined,
      });

      toast.success("Report submitted successfully. We'll review it shortly.");
      onClose();

      // Reset form
      setSelectedReason("");
      setDescription("");
    } catch (error) {
      console.error("Failed to submit report:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit report";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason("");
      setDescription("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive text-lg sm:text-xl">
            <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
            Report Listing
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Report &ldquo;{listingTitle}&rdquo; for violating our community
            guidelines
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
          {/* Warning Message */}
          <div className="flex gap-2 sm:gap-3 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-2 sm:p-3">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium mb-1">Important</p>
              <p className="text-[10px] sm:text-xs">
                False reports may result in account restrictions. Please report
                only genuine violations.
              </p>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="reason"
              className="text-xs sm:text-sm font-semibold"
            >
              Reason for Report <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-1 gap-1.5 sm:gap-2 max-h-[40vh] sm:max-h-none overflow-y-auto">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason.value}
                  onClick={() => setSelectedReason(reason.value)}
                  className={`text-left p-2 sm:p-3 rounded-lg border-2 transition-all hover:border-primary/50 ${
                    selectedReason === reason.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs sm:text-sm truncate">
                        {reason.label}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {reason.description}
                      </div>
                    </div>
                    {selectedReason === reason.value && (
                      <Badge
                        variant="default"
                        className="ml-2 flex-shrink-0 text-[10px] sm:text-xs px-1.5 sm:px-2"
                      >
                        Selected
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-xs sm:text-sm font-semibold"
            >
              Additional Details{" "}
              <span className="text-muted-foreground text-[10px] sm:text-xs">
                (Optional)
              </span>
            </Label>
            <Textarea
              id="description"
              placeholder="Provide any additional information that might help us understand the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] sm:min-h-[100px] resize-none text-xs sm:text-sm"
              maxLength={500}
            />
            <p className="text-[10px] sm:text-xs text-muted-foreground text-right">
              {description.length}/500 characters
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="w-full sm:w-auto min-w-[100px] text-xs sm:text-sm h-9 sm:h-10"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Submitting...
              </>
            ) : (
              <>
                <Flag className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Submit Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
