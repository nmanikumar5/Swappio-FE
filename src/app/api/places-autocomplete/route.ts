import { NextResponse } from "next/server";

// Simple in-memory cache with TTL to reduce repeated calls during development
const cache = new Map<string, { ts: number; data: unknown }>();
const TTL = 30 * 1000; // 30 seconds

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const q = url.searchParams.get("q") || "";
        const sessiontoken = url.searchParams.get("sessiontoken") || undefined;

        if (!q.trim()) return NextResponse.json({ predictions: [] });

        const key = `${q}::${sessiontoken || ""}`;
        const now = Date.now();
        const cached = cache.get(key);
        if (cached && now - cached.ts < TTL) {
            return NextResponse.json(cached.data as unknown);
        }

        const apiKey = process.env.MAPBOX_API_KEY || process.env.MAPBOX_ACCESS_TOKEN;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing Mapbox API key on server" }, { status: 500 });
        }

        // Mapbox forward geocoding (Places). We return a simplified predictions shape.
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            q
        )}.json?autocomplete=true&types=place,locality,neighborhood,region,country&limit=6&access_token=${encodeURIComponent(
            apiKey
        )}`;

        const res = await fetch(endpoint);
        if (!res.ok) {
            return NextResponse.json({ error: "Places API request failed" }, { status: 502 });
        }

        const json = await res.json();

        const features = (json && Array.isArray((json as Record<string, unknown>).features))
            ? ((json as Record<string, unknown>).features as unknown[])
            : [];

        const predictions = features.map((f) => {
            const rec = f as Record<string, unknown>;
            const place_id = typeof rec.id === "string" ? rec.id : String(rec.id ?? Math.random().toString(36).slice(2));
            const description = typeof rec.place_name === "string" ? rec.place_name : String(rec.place_name ?? "");
            return { place_id, description };
        });

        const normalized = { predictions, raw: json as unknown };

        cache.set(key, { ts: now, data: normalized });
        return NextResponse.json(normalized);
    } catch (err) {
        console.error("Places proxy error", err);
        return NextResponse.json({ error: "Internal" }, { status: 500 });
    }
}
