"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SlidersHorizontal,
  X,
  IndianRupee,
  ArrowUpDown,
  RotateCcw,
  Search,
} from "lucide-react";

interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

interface HorizontalFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

export default function HorizontalFilters({
  filters,
  onFiltersChange,
  onReset,
}: HorizontalFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (
    key: keyof FilterState,
    value: string | number | undefined
  ) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ""
  ).length;

  const conditionOptions = [
    { value: "new", label: "New", emoji: "✨" },
    { value: "like-new", label: "Like New", emoji: "⭐" },
    { value: "good", label: "Good", emoji: "👍" },
    { value: "fair", label: "Fair", emoji: "👌" },
    { value: "poor", label: "Poor", emoji: "📦" },
  ];

  return (
    <div className="space-y-2">
      {/* Main Filter Row - Compact Design */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-background/95 rounded-lg border border-border/50 shadow-sm">
        {/* Search - Compact */}
        <div className="flex-1 min-w-[180px] max-w-md relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Search..."
            value={localFilters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="h-9 pl-8 pr-3 text-sm rounded-lg border bg-background"
          />
        </div>

        {/* Price Range - Compact Inline */}
        <div className="flex items-center gap-1.5">
          <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Min"
            min="0"
            value={localFilters.minPrice || ""}
            onChange={(e) =>
              updateFilter(
                "minPrice",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="h-9 w-20 text-sm rounded-lg"
          />
          <span className="text-xs text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            min="0"
            value={localFilters.maxPrice || ""}
            onChange={(e) =>
              updateFilter(
                "maxPrice",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="h-9 w-20 text-sm rounded-lg"
          />
        </div>

        {/* Condition Select - Compact */}
        <Select
          value={localFilters.condition || "all"}
          onValueChange={(value) =>
            updateFilter("condition", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="h-9 w-[130px] text-sm rounded-lg">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="all">All</SelectItem>
            {conditionOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-sm"
              >
                {option.emoji} {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Select - Compact */}
        <Select
          value={
            localFilters.sortBy
              ? `${localFilters.sortBy}-${localFilters.sortOrder || "desc"}`
              : "default"
          }
          onValueChange={(value) => {
            if (value === "default") {
              updateFilter("sortBy", undefined);
              updateFilter("sortOrder", undefined);
            } else if (value === "newest") {
              updateFilter("sortBy", "createdAt");
              updateFilter("sortOrder", "desc");
            } else if (value === "oldest") {
              updateFilter("sortBy", "createdAt");
              updateFilter("sortOrder", "asc");
            } else if (value === "price-low") {
              updateFilter("sortBy", "price");
              updateFilter("sortOrder", "asc");
            } else if (value === "price-high") {
              updateFilter("sortBy", "price");
              updateFilter("sortOrder", "desc");
            } else if (value === "popular") {
              updateFilter("sortBy", "views");
              updateFilter("sortOrder", "desc");
            }
          }}
        >
          <SelectTrigger className="h-9 w-[140px] text-sm rounded-lg">
            <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="default" className="text-sm">
              Default
            </SelectItem>
            <SelectItem value="newest" className="text-sm">
              🆕 Newest
            </SelectItem>
            <SelectItem value="oldest" className="text-sm">
              📅 Oldest
            </SelectItem>
            <SelectItem value="price-low" className="text-sm">
              💰 Low→High
            </SelectItem>
            <SelectItem value="price-high" className="text-sm">
              💎 High→Low
            </SelectItem>
            <SelectItem value="popular" className="text-sm">
              🔥 Popular
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Actions - Compact */}
        <div className="flex items-center gap-1.5 ml-auto">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-9 px-3 text-sm rounded-lg hover:bg-destructive/10 hover:text-destructive"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset
            </Button>
          )}

          {/* <Button
            variant={showAdvanced ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-9 px-3 text-sm rounded-lg relative"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
            {showAdvanced ? "Less" : "More"}
            {activeFilterCount > 0 && (
              <Badge className="ml-1.5 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold rounded-full">
                {activeFilterCount}
              </Badge>
            )}
          </Button> */}
        </div>
      </div>

      {/* Advanced Filters Row - Compact Collapsible */}
      {/* {showAdvanced && (
        <div className="p-3 bg-muted/40 rounded-lg border border-border/50 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-muted-foreground mr-1">
              Quick Price:
            </span>
            {[
              { label: "Under ₹50", max: 50, emoji: "💸" },
              { label: "₹50-100", min: 50, max: 100, emoji: "💵" },
              { label: "₹100-500", min: 100, max: 500, emoji: "💰" },
              { label: "Over ₹500", min: 500, emoji: "💎" },
            ].map((range) => (
              <Button
                key={range.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  updateFilter("minPrice", range.min);
                  updateFilter("maxPrice", range.max);
                }}
                className={`h-8 px-3 text-xs rounded-lg transition-all ${
                  localFilters.minPrice === range.min &&
                  localFilters.maxPrice === range.max
                    ? "border-primary bg-primary/20 text-primary font-semibold"
                    : "hover:border-primary/50"
                }`}
              >
                <span className="mr-1">{range.emoji}</span>
                {range.label}
              </Button>
            ))}
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/30">
              <span className="text-xs font-semibold text-muted-foreground">
                Active ({activeFilterCount}):
              </span>

              {localFilters.search && (
                <Badge
                  variant="secondary"
                  className="gap-1 h-7 px-2 text-xs rounded-lg cursor-pointer hover:bg-primary/20"
                  onClick={() => updateFilter("search", undefined)}
                >
                  🔍 {localFilters.search}
                  <X className="h-3 w-3 hover:text-destructive" />
                </Badge>
              )}

              {(localFilters.minPrice || localFilters.maxPrice) && (
                <Badge
                  variant="secondary"
                  className="gap-1 h-7 px-2 text-xs rounded-lg cursor-pointer hover:bg-primary/20"
                  onClick={() => {
                    updateFilter("minPrice", undefined);
                    updateFilter("maxPrice", undefined);
                  }}
                >
                  💰 ₹{localFilters.minPrice || "0"}-₹
                  {localFilters.maxPrice || "∞"}
                  <X className="h-3 w-3 hover:text-destructive" />
                </Badge>
              )}

              {localFilters.condition && (
                <Badge
                  variant="secondary"
                  className="gap-1 h-7 px-2 text-xs rounded-lg cursor-pointer hover:bg-primary/20"
                  onClick={() => updateFilter("condition", undefined)}
                >
                  {
                    conditionOptions.find(
                      (c) => c.value === localFilters.condition
                    )?.emoji
                  }{" "}
                  {
                    conditionOptions.find(
                      (c) => c.value === localFilters.condition
                    )?.label
                  }
                  <X className="h-3 w-3 hover:text-destructive" />
                </Badge>
              )}
            </div>
          )}
        </div>
      )} */}
    </div>
  );
}
