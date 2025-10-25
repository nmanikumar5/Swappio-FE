"use client";

import Link from "next/link";
import { mockCategories } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  Laptop,
  Sofa,
  Car,
  Shirt,
  Book,
  Dumbbell,
  Home,
  Smartphone,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Laptop,
  Sofa,
  Car,
  Shirt,
  Book,
  Dumbbell,
  Home,
  Smartphone,
};

interface CategorySidebarProps {
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

export default function CategorySidebar({
  selectedCategory,
  onCategorySelect,
}: CategorySidebarProps) {
  return (
    <aside className="w-64 border-r bg-card">
      <div className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        <nav className="space-y-1">
          <Link
            href="/?category=all"
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
              !selectedCategory || selectedCategory === "all"
                ? "bg-accent font-medium"
                : ""
            )}
            onClick={() => onCategorySelect?.("all")}
          >
            <Home className="h-4 w-4" />
            <span>All Categories</span>
          </Link>

          {mockCategories.map((category) => {
            const Icon = iconMap[category.icon] || Home;
            return (
              <Link
                key={category.id}
                href={`/?category=${category.slug}`}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                  selectedCategory === category.slug
                    ? "bg-accent font-medium"
                    : ""
                )}
                onClick={() => onCategorySelect?.(category.slug)}
              >
                <Icon className="h-4 w-4" />
                <span>{category.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
