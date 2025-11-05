"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// TopProgress will use nprogress if available; otherwise falls back to a simple CSS bar.
export default function TopProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  // allow any here since we import nprogress dynamically and have a fallback
  const nprogressRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // try to dynamically import nprogress if present in node_modules
    let mounted = true;
    (async () => {
      try {
        const np = await import("nprogress");
        if (mounted) nprogressRef.current = (np.default || np) as unknown;
        // try to load nprogress CSS dynamically (best-effort)
        try {
          await import("nprogress/nprogress.css");
        } catch {}
      } catch {
        // nprogress not installed — fall back to CSS implementation
        nprogressRef.current = null;
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const isNProgress = (
      v: unknown
    ): v is { start: () => void; done: () => void } => {
      if (!v || typeof v !== "object") return false;
      // safe property checks without casting to any
      const candidate = v as Record<string, unknown>;
      const hasStart =
        Object.prototype.hasOwnProperty.call(candidate, "start") &&
        typeof candidate["start"] === "function";
      const hasDone =
        Object.prototype.hasOwnProperty.call(candidate, "done") &&
        typeof candidate["done"] === "function";
      return hasStart && hasDone;
    };

    if (nprogressRef.current) {
      try {
        if (isNProgress(nprogressRef.current)) {
          nprogressRef.current.start();
          if (timerRef.current) window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            nprogressRef.current.done();
          }, 600);
          return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
            if (nprogressRef.current && isNProgress(nprogressRef.current)) {
              const np = nprogressRef.current as {
                start: () => void;
                done: () => void;
              };
              np.done();
            }
          };
        }
      } catch {
        // fallback below
      }
    }

    // fallback CSS progress
    let raf = 0;
    raf = window.requestAnimationFrame(() => setVisible(true));
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      window.requestAnimationFrame(() => setVisible(false));
    }, 600);
    return () => {
      window.cancelAnimationFrame(raf);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [pathname]);

  // render nothing if nprogress will handle UI
  if (nprogressRef.current) return null;

  return (
    <div aria-hidden className="pointer-events-none">
      <div
        className={`fixed inset-x-0 top-0 z-50 h-0.5 transition-all duration-300 ease-in-out ${
          visible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        } origin-left bg-primary`}
      />
    </div>
  );
}
