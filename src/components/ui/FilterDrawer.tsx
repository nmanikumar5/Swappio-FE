"use client";

import React, { useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  isMobile?: boolean;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  title = "Filters",
  children,
  isMobile = false,
}: FilterDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    }

    return () => {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - Fixed to viewport, not scrollable */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Drawer - Fixed to viewport, not scrollable */}
      <div
        className={`fixed z-50 bg-background shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isMobile
            ? `inset-y-0 right-0 w-full max-w-sm ${
                isOpen
                  ? "animate-in slide-in-from-right"
                  : "animate-out slide-out-to-right"
              }`
            : `bottom-0 left-0 right-0 max-h-96 rounded-t-2xl ${
                isOpen
                  ? "animate-in slide-in-from-bottom"
                  : "animate-out slide-out-to-bottom"
              }`
        }`}
        style={{
          position: "fixed",
          top: isMobile ? 0 : "auto",
          right: isMobile ? 0 : "auto",
          bottom: isMobile ? 0 : 0,
          left: isMobile ? "auto" : 0,
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-muted rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div
          className={`flex-1 overflow-y-auto ${
            isMobile ? "p-4" : "p-3 md:p-4"
          }`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
