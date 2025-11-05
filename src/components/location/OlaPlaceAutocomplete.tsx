"use client";

import React, { useState, useEffect, useRef } from "react";
import useDebouncedValue from "@/hooks/useDebouncedValue";

interface Prediction {
  description: string;
  place_id?: string;
  id?: string;
  // Ola/places predictions may include a types array (place type hints)
  types?: string[];
  coords?: { lat: number; lng: number } | null;
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSelect?: (
    val: string,
    coords?: { lat: number; lng: number } | null
  ) => void;
}

export default function OlaPlaceAutocomplete({
  value,
  onChange,
  onSelect,
}: Props) {
  const [query, setQuery] = useState<string>(value || "");
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const ensureSessionToken = () => {
    if (!sessionTokenRef.current)
      sessionTokenRef.current = Math.random().toString(36).slice(2);
  };

  useEffect(() => {
    const t = setTimeout(() => setQuery(value || ""), 0);
    return () => clearTimeout(t);
  }, [value]);

  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      // Defer state updates to avoid synchronous setState inside effect
      setTimeout(() => {
        setSuggestions((prev) => (prev.length ? [] : prev));
        setOpen((prev) => (prev ? false : prev));
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
        const proxyToken = process.env.NEXT_PUBLIC_OLA_PROXY_TOKEN || "";
        const headers: Record<string, string> = {};
        if (proxyToken) {
          headers["x-ola-proxy-token"] = proxyToken;
          headers["authorization"] = `Bearer ${proxyToken}`;
        }

        const res = await fetch(
          `${apiUrl}/ola/autocomplete?q=${encodeURIComponent(
            debouncedQuery
          )}&sessiontoken=${sessionTokenRef.current}&limit=6&lang=en-IN`,
          { signal: controllerRef.current.signal, headers }
        );
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const preds = data.predictions || [];

        // Keep only city-level suggestions when available, otherwise fall back
        const filterCities = (suggestions: Prediction[]) => {
          return suggestions.filter((suggestion) => {
            if (!suggestion.types || !Array.isArray(suggestion.types))
              return false;
            return suggestion.types.some((type) =>
              [
                "locality",
                "administrative_area_level_1",
                "administrative_area_level_2",
              ].includes(type)
            );
          });
        };

        const cityFiltered = filterCities(preds);
        setSuggestions(cityFiltered.length ? cityFiltered : preds);
        setOpen(Boolean(preds && preds.length));
        setHighlight(0);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.warn("Places autocomplete failed", err);
      }
    };

    run();

    return () => {
      cancelled = true;
      controllerRef.current?.abort();
    };
  }, [debouncedQuery]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        sessionTokenRef.current = null;
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    return () => {
      try {
        controllerRef.current?.abort();
      } catch {
        /* ignore */
      }
      controllerRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block w-80">
      <input
        className="rounded-md border px-3 py-1 text-sm w-full"
        placeholder="Search places"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          ensureSessionToken();
          setOpen(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            setOpen(false);
            sessionTokenRef.current = null;
          }, 150);
        }}
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
              onChange(suggestions[highlight].description);
              if (onSelect)
                onSelect(
                  suggestions[highlight].description,
                  suggestions[highlight].coords || null
                );
              setQuery(suggestions[highlight].description);
              setOpen(false);
            }
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border bg-background shadow">
          {suggestions.map((s, idx) => (
            <li
              key={s.place_id || s.id || idx}
              className={`cursor-pointer px-3 py-2 ${
                highlight === idx ? "bg-accent" : ""
              }`}
              onMouseEnter={() => setHighlight(idx)}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(s.description);
                if (onSelect) {
                  try {
                    onSelect(s.description, s.coords || null);
                  } catch {
                    /* ignore */
                  }
                }
                setQuery(s.description);
                setOpen(false);
                sessionTokenRef.current = null;
              }}
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
