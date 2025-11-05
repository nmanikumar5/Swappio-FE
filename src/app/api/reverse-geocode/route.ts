import { NextResponse } from 'next/server';

// Simple in-memory cache for reverse-geocode results during the server runtime.
const cache = new Map<string, { displayName: string; raw: unknown }>();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const lat = url.searchParams.get('lat');
        const lon = url.searchParams.get('lon');

        if (!lat || !lon) {
            return NextResponse.json({ error: 'Missing lat or lon' }, { status: 400 });
        }

        const key = `${lat},${lon}`;
        if (cache.has(key)) {
            return NextResponse.json(cache.get(key));
        }

        // Call OpenStreetMap Nominatim reverse geocoding API
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
            lat
        )}&lon=${encodeURIComponent(lon)}`;

        const res = await fetch(nominatimUrl, {
            headers: {
                // Respect Nominatim usage policy: include a descriptive User-Agent
                'User-Agent': 'Swappio/1.0 (contact: dev@swappio.local)'
            }
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Reverse geocoding failed' }, { status: 502 });
        }

        const data = await res.json();

        // Prefer a city/town/village, fallback to county or display_name
        const addr = data.address || {};
        const displayName = addr.city || addr.town || addr.village || addr.county || data.display_name || `${lat}, ${lon}`;

        const payload = { displayName, raw: data };
        // Cache for subsequent requests in this server instance
        cache.set(key, payload);

        return NextResponse.json(payload);
    } catch (err) {
        console.error('Reverse geocode error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
