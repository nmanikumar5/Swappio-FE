"use client";

import { Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ViewOptionsProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  onFilterClick?: () => void;
}

export default function ViewOptions({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
  onFilterClick,
}: ViewOptionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 p-2 sm:p-4 bg-card border-b border-border">
      {/* Left side - View toggles */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="px-3 h-8"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="px-3 h-8"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Filter Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          className="xl:hidden flex items-center gap-1 h-8 px-2 sm:px-3"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline text-xs sm:text-sm">Filters</span>
        </Button>
      </div>

      {/* Right side - Sort and Items per page */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sort */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
            Sort:
          </span>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[120px] sm:w-[160px] h-8 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items per page - Desktop only */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(val) => onItemsPerPageChange(Number(val))}
          >
            <SelectTrigger className="w-[80px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="36">36</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
