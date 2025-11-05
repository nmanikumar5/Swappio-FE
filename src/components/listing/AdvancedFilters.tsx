"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Package,
  ArrowUpDown,
} from "lucide-react";

interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  onReset,
  isMobile = false,
  onClose,
}: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const updateFilter = (
    key: keyof FilterState,
    value: string | number | undefined
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    if (isMobile && onClose) onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
    if (isMobile && onClose) onClose();
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ""
  ).length;

  const conditionOptions = [
    { value: "new", label: "New" },
    { value: "like-new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ];

  return (
    <Card className={`gradient-border ${isMobile ? "h-full" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <SlidersHorizontal className="h-5 w-5" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-primary">{activeFilterCount}</Badge>
          )}
        </CardTitle>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Search Keywords
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by title or description..."
            value={localFilters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Price Range
          </Label>
          <div className="flex items-center gap-2">
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
            />
            <span className="text-muted-foreground">-</span>
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
            />
          </div>
          {/* Quick Price Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Under ₹50", max: 50 },
              { label: "₹50-₹100", min: 50, max: 100 },
              { label: "₹100-₹500", min: 100, max: 500 },
              { label: "Over ₹500", min: 500 },
            ].map((range) => (
              <Button
                key={range.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  updateFilter("minPrice", range.min);
                  updateFilter("maxPrice", range.max);
                }}
                className={
                  localFilters.minPrice === range.min &&
                  localFilters.maxPrice === range.max
                    ? "border-primary bg-primary/10"
                    : ""
                }
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-2">
          <Label htmlFor="condition">Item Condition</Label>
          <Select
            value={localFilters.condition || undefined}
            onValueChange={(value) =>
              updateFilter("condition", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger id="condition">
              <SelectValue placeholder="Any condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any condition</SelectItem>
              {conditionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sortBy" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sort By
          </Label>
          <Select
            value={
              localFilters.sortBy
                ? `${localFilters.sortBy}-${localFilters.sortOrder || "desc"}`
                : undefined
            }
            onValueChange={(value) => {
              if (!value || value === "default") {
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
            <SelectTrigger id="sortBy">
              <SelectValue placeholder="Default sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default sorting</SelectItem>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReset}
            disabled={activeFilterCount === 0}
          >
            Reset All
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="space-y-2 border-t pt-4">
            <Label className="text-sm">Active Filters:</Label>
            <div className="flex flex-wrap gap-2">
              {localFilters.search && (
                <Badge variant="secondary" className="gap-1">
                  Search: {localFilters.search}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter("search", undefined)}
                  />
                </Badge>
              )}
              {(localFilters.minPrice || localFilters.maxPrice) && (
                <Badge variant="secondary" className="gap-1">
                  ₹{localFilters.minPrice || "0"} - ₹
                  {localFilters.maxPrice || "∞"}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      updateFilter("minPrice", undefined);
                      updateFilter("maxPrice", undefined);
                    }}
                  />
                </Badge>
              )}
              {localFilters.condition && (
                <Badge variant="secondary" className="gap-1">
                  {conditionOptions.find(
                    (c) => c.value === localFilters.condition
                  )?.label || localFilters.condition}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter("condition", undefined)}
                  />
                </Badge>
              )}
              {localFilters.sortBy && (
                <Badge variant="secondary" className="gap-1">
                  {sortOptions.find(
                    (s) =>
                      s.value ===
                      `${localFilters.sortBy}-${localFilters.sortOrder}`
                  )?.label ||
                    `${localFilters.sortBy} ${localFilters.sortOrder}`}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      updateFilter("sortBy", undefined);
                      updateFilter("sortOrder", undefined);
                    }}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
