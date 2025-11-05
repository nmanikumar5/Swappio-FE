"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  X,
  IndianRupee,
  Package,
  Calendar,
  TrendingUp,
  Sparkles,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  postedWithin?: string;
  featured?: boolean;
}

interface LeftSidebarFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function LeftSidebarFilters({
  filters,
  onFiltersChange,
  onReset,
  onCollapseChange,
}: LeftSidebarFiltersProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    condition: true,
    sort: false,
    posted: false,
  });

  const handleCollapseToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapseChange?.(collapsed);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    onFiltersChange({
      ...filters,
      [type === "min" ? "minPrice" : "maxPrice"]: numValue,
    });
  };

  const handleConditionChange = (value: string) => {
    onFiltersChange({
      ...filters,
      condition: value === "all" ? undefined : value,
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy === "default" ? undefined : sortBy,
      sortOrder: sortBy === "default" ? undefined : sortOrder,
    });
  };

  const activeFiltersCount = [
    filters.minPrice,
    filters.maxPrice,
    filters.condition,
    filters.sortBy,
    filters.postedWithin,
    filters.featured,
  ].filter(Boolean).length;

  if (isCollapsed) {
    return (
      <div className="hidden lg:flex fixed left-0 top-[112px] z-30 h-[calc(100vh-112px)]">
        <button
          onClick={() => handleCollapseToggle(false)}
          className="w-12 bg-gradient-to-b from-primary/10 to-secondary/10 border-r border-t border-b hover:from-primary/20 hover:to-secondary/20 transition-all flex items-center justify-center group shadow-md"
          title="Show filters"
        >
          <div className="flex flex-col items-center gap-2 py-4">
            <ChevronRight className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            <div className="flex flex-col items-center">
              {["F", "I", "L", "T", "E", "R", "S"].map((letter, i) => (
                <span
                  key={i}
                  className="text-xs font-bold text-primary leading-tight"
                >
                  {letter}
                </span>
              ))}
            </div>
            {activeFiltersCount > 0 && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-bold flex items-center justify-center shadow-lg animate-pulse">
                {activeFiltersCount}
              </div>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="hidden lg:block fixed left-0 top-[112px] w-72 h-[calc(100vh-200px)] bg-gradient-to-b from-card via-card to-muted/30 border-r shadow-xl z-30 overflow-y-auto custom-scrollbar">
      <div className="sticky top-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-md border-b border-primary/20 p-4 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Advanced Filters
            </h3>
            {activeFiltersCount > 0 && (
              <p className="text-[10px] text-muted-foreground font-medium">
                {activeFiltersCount} active
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCollapseToggle(true)}
          className="h-8 w-8 hover:bg-primary/10 rounded-lg transition-all hover:scale-110"
        >
          <ChevronLeft className="h-4 w-4 text-primary" />
        </Button>
      </div>

      <div className="p-4 space-y-3">
        <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl border border-border/50 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm">
                <IndianRupee className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">Price Range</span>
            </div>
            {expandedSections.price ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.price && (
            <div className="p-3 pt-0 space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ""}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    className="h-9 pl-8 text-sm rounded-lg"
                  />
                </div>
                <span className="self-center">→</span>
                <div className="flex-1 relative">
                  <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    className="h-9 pl-8 text-sm rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Under ₹500", max: 500, emoji: "💸" },
                  { label: "₹500-₹2K", min: 500, max: 2000, emoji: "💵" },
                  { label: "₹2K-₹10K", min: 2000, max: 10000, emoji: "💰" },
                  { label: "₹10K+", min: 10000, emoji: "💎" },
                ].map((range) => (
                  <Button
                    key={range.label}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        minPrice: range.min,
                        maxPrice: range.max,
                      })
                    }
                    className={cn(
                      "h-9 text-xs",
                      filters.minPrice === range.min &&
                        filters.maxPrice === range.max &&
                        "bg-primary text-white"
                    )}
                  >
                    {range.emoji} {range.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl border border-border/50 shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection("condition")}
            className="w-full flex items-center justify-between p-3 hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Package className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">Condition</span>
            </div>
            {expandedSections.condition ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.condition && (
            <div className="p-3 pt-0">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "new", label: "New", emoji: "✨" },
                  { value: "like-new", label: "Like New", emoji: "⭐" },
                  { value: "good", label: "Good", emoji: "👍" },
                  { value: "fair", label: "Fair", emoji: "👌" },
                ].map((c) => (
                  <Button
                    key={c.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleConditionChange(c.value)}
                    className={cn(
                      "h-11 text-xs flex flex-col",
                      filters.condition === c.value && "bg-primary text-white"
                    )}
                  >
                    <span className="text-base">{c.emoji}</span>
                    <span>{c.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl border border-border/50 shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection("sort")}
            className="w-full flex items-center justify-between p-3 hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                <TrendingUp className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">Sort By</span>
            </div>
            {expandedSections.sort ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.sort && (
            <div className="p-3 pt-0 space-y-1.5">
              {[
                {
                  label: "Newest First",
                  sortBy: "createdAt",
                  sortOrder: "desc" as const,
                  emoji: "🆕",
                },
                {
                  label: "Oldest First",
                  sortBy: "createdAt",
                  sortOrder: "asc" as const,
                  emoji: "📅",
                },
                {
                  label: "Price: Low → High",
                  sortBy: "price",
                  sortOrder: "asc" as const,
                  emoji: "💰",
                },
                {
                  label: "Price: High → Low",
                  sortBy: "price",
                  sortOrder: "desc" as const,
                  emoji: "💎",
                },
                {
                  label: "Most Popular",
                  sortBy: "views",
                  sortOrder: "desc" as const,
                  emoji: "🔥",
                },
              ].map((s) => (
                <Button
                  key={s.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortChange(s.sortBy, s.sortOrder)}
                  className={cn(
                    "w-full h-9 text-xs justify-start",
                    filters.sortBy === s.sortBy &&
                      filters.sortOrder === s.sortOrder &&
                      "bg-primary text-white"
                  )}
                >
                  {s.emoji} {s.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl border border-border/50 shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection("posted")}
            className="w-full flex items-center justify-between p-3 hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                <Calendar className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">Posted Within</span>
            </div>
            {expandedSections.posted ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.posted && (
            <div className="p-3 pt-0 space-y-1.5">
              {[
                { label: "Last 24 Hours", value: "1d", emoji: "🕐" },
                { label: "Last 3 Days", value: "3d", emoji: "📆" },
                { label: "Last Week", value: "7d", emoji: "📅" },
                { label: "Last Month", value: "30d", emoji: "🗓️" },
              ].map((p) => (
                <Button
                  key={p.value}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      postedWithin:
                        filters.postedWithin === p.value ? undefined : p.value,
                    })
                  }
                  className={cn(
                    "w-full h-9 text-xs justify-start",
                    filters.postedWithin === p.value && "bg-primary text-white"
                  )}
                >
                  {p.emoji} {p.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl border border-border/50 shadow-md overflow-hidden">
          <button
            onClick={() =>
              onFiltersChange({ ...filters, featured: !filters.featured })
            }
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl transition-all",
              filters.featured
                ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white"
                : "hover:bg-muted/50"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles
                className={cn("h-5 w-5", filters.featured && "animate-pulse")}
              />
              <div className="text-left">
                <span className="text-sm font-bold block">Featured Only</span>
                <span className="text-[10px] opacity-90">Premium listings</span>
              </div>
            </div>
            <div
              className={cn(
                "w-11 h-6 rounded-full relative",
                filters.featured ? "bg-white/30" : "bg-border"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-transform",
                  filters.featured && "translate-x-5"
                )}
              />
            </div>
          </button>
        </div>

        {activeFiltersCount > 0 && (
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/20 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                Active ({activeFiltersCount})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-7 px-2.5 text-xs hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(filters.minPrice || filters.maxPrice) && (
                <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                  💰 ₹{filters.minPrice || "0"} - ₹{filters.maxPrice || "∞"}
                </Badge>
              )}
              {filters.condition && (
                <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30 capitalize">
                  📦 {filters.condition}
                </Badge>
              )}
              {filters.sortBy && (
                <Badge className="bg-purple-500/20 text-purple-700 border-purple-500/30">
                  🔄 {filters.sortBy} {filters.sortOrder === "asc" ? "↑" : "↓"}
                </Badge>
              )}
              {filters.postedWithin && (
                <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/30">
                  📅 {filters.postedWithin}
                </Badge>
              )}
              {filters.featured && (
                <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
                  ⭐ Featured
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border p-3.5">
          <div className="flex gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-bold mb-1">💡 Pro Tip</p>
              <p className="text-[10px] text-muted-foreground">
                Combine filters to find exactly what you need!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
