"use client";

import React, { useState, useEffect, useRef } from "react";
import useDebouncedValue from "@/hooks/useDebouncedValue";

interface ISuggestion {
  id?: string;
  name: string;
  description: string;
  coords?: { lat: number; lng: number } | null;
  types?: string[];
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSelect?: (
    val: string,
    coords?: { lat: number; lng: number } | null
  ) => void;
}

export default function MapboxPlaceAutocomplete({
  value,
  onChange,
  onSelect,
}: Props) {
  const [query, setQuery] = useState<string>(value || "");
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const ensureSessionToken = () => {
    if (!sessionTokenRef.current)
      sessionTokenRef.current = Math.random().toString(36).slice(2);
  };

  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (!debouncedQuery || !sessionTokenRef.current) {
      // Defer updates to avoid synchronous setState inside effect
      setTimeout(() => {
        setSuggestions([]);
        setOpen(false);
      }, 0);
      return;
    }

    let cancelled = false;
    const run = async () => {
      try {
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(
          /\/$/,
          ""
        );
        const res = await fetch(
          `${apiUrl}/mapbox/autocomplete?q=${encodeURIComponent(
            debouncedQuery
          )}&limit=6&lang=en-IN&session_token=${sessionTokenRef.current}`,
          { signal: controllerRef.current.signal }
        );
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const preds = data.suggestions || [];

        setSuggestions(preds);
        setOpen(Boolean(preds && preds.length));
        setHighlight(0);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.warn("Mapbox places failed", err);
      }
    };

    run();
    return () => {
      cancelled = true;
      controllerRef.current?.abort();
    };
  }, [debouncedQuery]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Keep internal query in sync when parent `value` changes (e.g. geolocation sets location)
  useEffect(() => {
    if (value !== undefined && value !== query) {
      setQuery(value);
      // notify parent of change (avoid infinite loop if parent already has same value)
      try {
        onChange(value);
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          ensureSessionToken();
          setOpen(true);
        }}
        className="flex h-10 w-full rounded-xl border-2 border-border bg-transparent px-3 py-2 text-sm shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus-visible:outline-none"
        placeholder="Search for a location..."
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
            e.preventDefault();
          } else if (e.key === "ArrowUp") {
            setHighlight((h) => Math.max(h - 1, 0));
            e.preventDefault();
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (suggestions[highlight]) {
              onChange(suggestions[highlight].name);
              if (onSelect)
                onSelect(
                  suggestions[highlight].name,
                  suggestions[highlight].coords || null
                );
              setQuery(suggestions[highlight].name);
              setOpen(false);
            }
          } else if (e.key === "Escape") setOpen(false);
        }}
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-xl border-2 border-border bg-background shadow-xl">
          {suggestions.map((s, idx) => (
            <li
              key={s.id || idx}
              className={`cursor-pointer px-4 py-3 text-sm transition-colors hover:bg-accent/50 ${
                highlight === idx ? "bg-accent" : ""
              }`}
              onMouseEnter={() => setHighlight(idx)}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(s.name);
                if (onSelect) onSelect(s.name, s.coords || null);
                setQuery(s.name);
                setOpen(false);
              }}
            >
              <div className="font-medium">{s?.name}</div>
              {s?.description && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {s.description}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
