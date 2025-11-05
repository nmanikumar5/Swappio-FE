"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUp,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  onFilterClick?: () => void;
  onSearchClick?: () => void;
}

export default function FloatingActionButton({
  onFilterClick,
  onSearchClick,
}: FloatingActionButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top button when scrolled down
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setShowScrollTop(window.scrollY > 400);
    });
  }

  const actions: FABAction[] = [
    {
      icon: <Plus className="h-5 w-5" />,
      label: "Post Ad",
      onClick: () => router.push("/post-ad"),
      color: "bg-gradient-to-r from-primary to-secondary",
    },
    {
      icon: <Search className="h-5 w-5" />,
      label: "Search",
      onClick: () => onSearchClick?.(),
      color: "bg-blue-500",
    },
    {
      icon: <SlidersHorizontal className="h-5 w-5" />,
      label: "Filters",
      onClick: () => onFilterClick?.(),
      color: "bg-purple-500",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Messages",
      onClick: () => router.push("/chat"),
      color: "bg-green-500",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 h-12 w-12 rounded-full shadow-xl hover:scale-110 transition-transform bg-secondary"
          size="icon"
          title="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      {/* FAB Menu */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Action Buttons - Show when open */}
        {isOpen && (
          <div className="mb-4 flex flex-col-reverse gap-3">
            {actions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-3 animate-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Label */}
                <div className="rounded-lg bg-background px-3 py-1.5 shadow-md border text-sm font-medium whitespace-nowrap">
                  {action.label}
                </div>
                {/* Button */}
                <Button
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "h-12 w-12 rounded-full shadow-lg hover:scale-110 transition-transform text-white",
                    action.color
                  )}
                  size="icon"
                  title={action.label}
                >
                  {action.icon}
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Main FAB Button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-16 w-16 rounded-full shadow-2xl transition-all duration-300",
            isOpen
              ? "rotate-45 bg-red-500 hover:bg-red-600"
              : "bg-gradient-to-r from-primary to-secondary hover:scale-110"
          )}
          size="icon"
          title={isOpen ? "Close menu" : "Quick actions"}
        >
          <Plus className="h-7 w-7 text-white" />
        </Button>
      </div>
    </>
  );
}
