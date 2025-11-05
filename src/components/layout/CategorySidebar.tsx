"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { categoryService } from "@/services/api";
import { Category } from "@/types";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";

const {
  Laptop,
  Sofa,
  Car,
  Shirt,
  Book,
  Dumbbell,
  Home,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Building2,
  Briefcase,
  Dog,
  Baby,
  Factory,
  Tractor,
  Phone,
  Headphones,
  Tv,
  Camera,
  Music,
  Gamepad2,
  Snowflake,
  Wind,
  CookingPot,
  Bike,
  Truck,
  Wrench,
  Map,
  Building,
  Hotel,
  Armchair,
  Bed,
  Utensils,
  Lamp,
  Trees,
  User,
  Footprints,
  Watch,
  Backpack,
  Gem,
  BookOpen,
  Trophy,
  Palette,
  Cat,
  Fish,
  Bird,
  PawPrint,
  Apple,
  Code,
  TrendingUp,
  GraduationCap,
  Heart,
  Clock,
  Hammer,
  Sparkles,
  PartyPopper,
  Puzzle,
  Printer,
  Cog,
  Stethoscope,
  UtensilsCrossed,
  Sprout,
  WashingMachine,
} = Icons;

const iconMap: Record<string, LucideIcon> = {
  Laptop,
  Sofa,
  Car,
  Shirt,
  Book,
  Dumbbell,
  Home,
  Smartphone,
  Building2,
  Briefcase,
  Dog,
  Baby,
  Factory,
  Tractor,
  Phone,
  Headphones,
  Tv,
  Camera,
  Music,
  Gamepad2,
  Snowflake,
  Wind,
  CookingPot,
  Bike,
  Truck,
  Wrench,
  Map,
  Building,
  Hotel,
  Armchair,
  Bed,
  Utensils,
  Lamp,
  Trees,
  User,
  Footprints,
  Watch,
  Backpack,
  Gem,
  BookOpen,
  Trophy,
  Palette,
  Cat,
  Fish,
  Bird,
  PawPrint,
  Apple,
  Code,
  TrendingUp,
  GraduationCap,
  Heart,
  Clock,
  Hammer,
  Sparkles,
  PartyPopper,
  Puzzle,
  Printer,
  Cog,
  Stethoscope,
  UtensilsCrossed,
  Sprout,
  WashingMachine,
};

interface CategorySidebarProps {
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

export default function CategorySidebar({
  selectedCategory,
  onCategorySelect,
}: CategorySidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories({
          parentOnly: true,
          includeSubcategories: false,
        });
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Initialize from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved === "true";
    }
    return false;
  });

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(newState));
    }
  };

  return (
    <aside
      className={cn(
        "relative border-r bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse/Expand Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleCollapse}
        className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border bg-background p-0 shadow-md hover:bg-accent"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className={cn("p-4", isCollapsed && "px-2")}>
        {!isCollapsed && (
          <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        )}
        <nav className="space-y-1">
          <Link
            href="/?category=all"
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              isCollapsed ? "justify-center" : "space-x-3",
              !selectedCategory || selectedCategory === "all"
                ? "bg-accent font-medium"
                : ""
            )}
            onClick={() => onCategorySelect?.("all")}
            title={isCollapsed ? "All Categories" : ""}
          >
            <Home className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>All Categories</span>}
          </Link>

          {loading
            ? // Loading skeleton
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2",
                    isCollapsed ? "justify-center" : "space-x-3"
                  )}
                >
                  <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                  {!isCollapsed && (
                    <div className="h-4 flex-1 bg-muted rounded animate-pulse" />
                  )}
                </div>
              ))
            : categories.map((category) => {
                const Icon = iconMap[category.icon] || Home;
                return (
                  <Link
                    key={category.id}
                    href={`/?category=${category.slug}`}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                      isCollapsed ? "justify-center" : "space-x-3",
                      selectedCategory === category.slug
                        ? "bg-accent font-medium"
                        : ""
                    )}
                    onClick={() => onCategorySelect?.(category.slug)}
                    title={isCollapsed ? category.name : ""}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && <span>{category.name}</span>}
                  </Link>
                );
              })}
        </nav>

        {/* Category Count - Only show when expanded */}
        {!isCollapsed && !loading && categories.length > 0 && (
          <div className="mt-6 rounded-lg bg-primary/5 p-3">
            <p className="text-xs text-muted-foreground">
              {categories.length} categories available
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
