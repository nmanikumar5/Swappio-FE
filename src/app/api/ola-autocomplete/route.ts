import { NextResponse } from "next/server";

// Simple in-memory cache
const cache = new Map<string, { ts: number; data: unknown }>();
const TTL = 30 * 1000;

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const q = url.searchParams.get("q") || "";

        if (!q.trim()) return NextResponse.json({ predictions: [] });

        const key = q;
        const now = Date.now();
        const cached = cache.get(key);
        if (cached && now - cached.ts < TTL) {
            return NextResponse.json(cached.data as unknown);
        }

        // User must set OLA_AUTOCOMPLETE_URL in env to point to their Ola Maps autocomplete endpoint
        const endpointBase = process.env.OLA_AUTOCOMPLETE_URL;
        // accept common env var names for Ola API key
        const apiKey = process.env.OLA_API_KEY;

        if (!endpointBase) {
            return NextResponse.json({ error: "Missing OLA_AUTOCOMPLETE_URL env" }, { status: 500 });
        }

        // Ola Maps expects `input` and `api_key` query params; forward sessiontoken as X-Request-Id header
        const sessiontoken = url.searchParams.get("sessiontoken") || undefined;
        const params = new URLSearchParams({ input: q });
        if (apiKey) params.set("api_key", apiKey);

        const endpoint = `${endpointBase}?${params.toString()}`;
        // Call upstream Ola endpoint and capture response text for better debugging
        let upstreamText: string | null = null;
        let json: unknown = null;
        try {
            const headers: Record<string, string> = {};
            if (sessiontoken) headers["X-Request-Id"] = sessiontoken;
            if (apiKey) {
                headers["X-Api-Key"] = apiKey;
                headers["Authorization"] = `Bearer ${apiKey}`;
            }

            const res = await fetch(endpoint, { headers });
            upstreamText = await res.text();

            if (!res.ok) {
                const bodyPreview = upstreamText ? upstreamText.slice(0, 1000) : undefined;
                console.error("Ola upstream error", { status: res.status, bodyPreview });
                const payload: Record<string, unknown> = { error: "Ola API request failed", status: res.status };
                // In dev, include the upstream body and called endpoint (without api_key) to aid debugging.
                if (process.env.NODE_ENV !== "production") {
                    payload.upstream = bodyPreview;
                    // redact api_key from the endpoint shown in errors
                    try {
                        const u = new URL(endpoint);
                        u.searchParams.delete("api_key");
                        payload.endpoint = u.toString();
                    } catch {
                        payload.endpoint = endpoint;
                    }
                }
                return NextResponse.json(payload, { status: 502 });
            }

            try {
                json = upstreamText ? JSON.parse(upstreamText) : {};
            } catch {
                // upstream returned non-JSON; fall back to raw text
                json = upstreamText;
            }
        } catch (err) {
            console.error("Ola fetch failed", err);
            return NextResponse.json({ error: "Ola upstream fetch error", details: String(err) }, { status: 502 });
        }

        // Try to normalize: expect json.predictions or json.suggestions or json.features
        const obj = json as Record<string, unknown>;
        const asStr = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);
        const extract = (item: unknown, keys: string[]) => {
            const rec = item as Record<string, unknown> | undefined;
            if (!rec) return undefined;
            for (const k of keys) {
                if (k in rec) {
                    const s = asStr(rec[k]);
                    if (s) return s;
                }
            }
            return undefined;
        };

        let preds: { id: string; description: string }[] = [];

        const maybePredictions = obj["predictions"] as unknown;
        const maybeSuggestions = obj["suggestions"] as unknown;
        const maybeFeatures = obj["features"] as unknown;

        if (Array.isArray(maybePredictions)) {
            preds = maybePredictions.map((p) => {
                const id = extract(p, ["id", "place_id", "key"]) || String(Math.random());
                const desc = extract(p, ["description", "place_name", "text"]) || JSON.stringify(p);
                return { id, description: desc };
            });
        } else if (Array.isArray(maybeSuggestions)) {
            preds = maybeSuggestions.map((p) => {
                const id = extract(p, ["id"]) || String(Math.random());
                const desc = extract(p, ["name", "display", "text"]) || JSON.stringify(p);
                return { id, description: desc };
            });
        } else if (Array.isArray(maybeFeatures)) {
            preds = maybeFeatures.map((f) => {
                const id = extract(f, ["id"]) || String(Math.random());
                const desc = extract(f, ["place_name", "text"]) || JSON.stringify(f);
                return { id, description: desc };
            });
        } else {
            preds = [];
        }

        const normalized = { predictions: preds, raw: json as unknown };
        cache.set(key, { ts: now, data: normalized });
        return NextResponse.json(normalized);
    } catch (err) {
        console.error("Ola autocomplete proxy error", err);
        return NextResponse.json({ error: "Internal" }, { status: 500 });
    }
}
