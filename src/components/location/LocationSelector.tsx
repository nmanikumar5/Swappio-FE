"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export default function LocationSelector({
  value,
  onChange,
  options,
  placeholder,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>(value || "");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  // update query when value changes (non-synchronous reset handled via setTimeout to avoid cascading renders)
  useEffect(() => {
    const t = setTimeout(() => setQuery(value || ""), 0);
    return () => clearTimeout(t);
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlight((h) => Math.max(h - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlight]) {
        onChange(filtered[highlight]);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative inline-block w-full sm:w-64">
      <input
        ref={inputRef}
        className="rounded-lg sm:rounded-md border-2 border-border px-2 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm w-full hover:border-primary/50 focus:border-primary transition-colors"
        placeholder={placeholder || "Enter location..."}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        aria-controls="location-listbox"
        aria-autocomplete="list"
      />

      {open && filtered.length > 0 && (
        <ul
          id="location-listbox"
          role="listbox"
          className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg sm:rounded-md border-2 border-border bg-background shadow-lg"
        >
          {filtered.map((opt, idx) => (
            <li
              key={opt}
              role="option"
              aria-selected={highlight === idx}
              className={`cursor-pointer px-2 sm:px-3 py-2 text-xs sm:text-sm transition-colors ${
                highlight === idx
                  ? "bg-primary/20 text-primary font-medium"
                  : "hover:bg-muted"
              }`}
              onMouseEnter={() => setHighlight(idx)}
              onMouseDown={(e) => {
                // onMouseDown to prevent input blur before click
                e.preventDefault();
                onChange(opt);
                setOpen(false);
                inputRef.current?.blur();
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
