"use client";

import Link from "next/link";
import { Category } from "@/types";
import { categoryService } from "@/services/api";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface CategoryBarProps {
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function CategoryBar({
  selectedCategory,
  onCategorySelect,
  searchValue = "",
  onSearchChange,
}: CategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories({
          parentOnly: true,
          includeSubcategories: true,
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

  const checkScroll = () => {
    const element = scrollRef.current;
    if (!element) return;
    setShowLeftArrow(element.scrollLeft > 0);
    setShowRightArrow(
      element.scrollLeft < element.scrollWidth - element.clientWidth - 10
    );
  };

  useEffect(() => {
    checkScroll();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", checkScroll);
      return () => element.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full bg-card border-b border-border shadow-sm sticky top-16 z-40">
      <div className="container mx-auto px-2 sm:px-4 relative">
        <div className="flex items-center gap-2 py-2 sm:py-3">
          {isAuthenticated && onSearchChange && (
            <div className="relative w-32 sm:w-48 lg:w-64 flex-shrink-0">
              <Icons.Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8 sm:h-9 pl-7 sm:pl-8 pr-2 sm:pr-3 text-xs sm:text-sm rounded-lg border"
              />
            </div>
          )}

          {showLeftArrow && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("left")}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-background/95 shadow-lg hover:bg-accent flex-shrink-0"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}

          <div
            ref={scrollRef}
            className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all hover:bg-accent flex-shrink-0",
                    !selectedCategory || selectedCategory === "all"
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">All</span>
                  <Icons.ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-48 sm:w-64 max-h-[400px] overflow-y-auto"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/?category=all"
                    className="font-semibold cursor-pointer text-xs sm:text-sm"
                    onClick={() => onCategorySelect?.("all")}
                  >
                    <Home className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    All Categories
                  </Link>
                </DropdownMenuItem>
                <div className="h-px bg-border my-1" />
                {categories.map((category) => {
                  const Icon = iconMap[category.icon] || Home;
                  return (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link
                        href={`/?category=${category.slug}`}
                        className="cursor-pointer text-xs sm:text-sm"
                        onClick={() => onCategorySelect?.(category.slug)}
                      >
                        <Icon className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-muted animate-pulse flex-shrink-0 h-7 sm:h-9 w-24 sm:w-32"
                  />
                ))
              : categories.map((category) => {
                  const Icon = iconMap[category.icon] || Home;
                  const isActive = selectedCategory === category.slug;
                  const hasSubcategories =
                    category.subcategories && category.subcategories.length > 0;

                  if (hasSubcategories) {
                    return (
                      <DropdownMenu key={category.id}>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={cn(
                              "flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all hover:bg-accent flex-shrink-0",
                              isActive
                                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                                : "bg-muted hover:bg-muted/80"
                            )}
                          >
                            <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">
                              {category.name}
                            </span>
                            <Icons.ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-50" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-48 sm:w-56 max-h-[400px] overflow-y-auto"
                        >
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/?category=${category.slug}`}
                              className="font-semibold cursor-pointer text-xs sm:text-sm"
                              onClick={() => onCategorySelect?.(category.slug)}
                            >
                              <Icon className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              All {category.name}
                            </Link>
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-1" />
                          {category.subcategories?.map((subcat: Category) => (
                            <DropdownMenuItem key={subcat.id} asChild>
                              <Link
                                href={`/?category=${subcat.slug}`}
                                className="cursor-pointer pl-6 text-xs sm:text-sm"
                                onClick={() => onCategorySelect?.(subcat.slug)}
                              >
                                {subcat.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  }

                  return (
                    <Link
                      key={category.id}
                      href={`/?category=${category.slug}`}
                      className={cn(
                        "flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all hover:bg-accent flex-shrink-0",
                        isActive
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                          : "bg-muted hover:bg-muted/80"
                      )}
                      onClick={() => onCategorySelect?.(category.slug)}
                    >
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                    </Link>
                  );
                })}
          </div>

          {showRightArrow && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("right")}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 h-7 sm:h-8 w-7 sm:w-8 rounded-full bg-background/95 shadow-lg hover:bg-accent"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
