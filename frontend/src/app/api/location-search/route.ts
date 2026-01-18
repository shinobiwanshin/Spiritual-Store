import { NextRequest, NextResponse } from "next/server";

const GEOCODING_API =
  process.env.GEOCODING_API || "https://nominatim.openstreetmap.org/search";
const FETCH_TIMEOUT_MS = 5000;

// Force dynamic rendering since we use request.url
export const dynamic = "force-dynamic";

interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}

// Location autocomplete search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 3) {
      return NextResponse.json({ results: [] });
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(
        `${GEOCODING_API}?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        {
          headers: {
            "User-Agent": "AstraSpiritual/1.0",
          },
          signal: controller.signal,
        },
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if ((fetchError as Error).name === "AbortError") {
        console.error("Location search timeout for query:", query);
        return NextResponse.json({ error: "Request timeout" }, { status: 504 });
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      console.error("Location search API error:", {
        status: response.status,
        statusText: response.statusText,
        query,
      });
      return NextResponse.json({ results: [] });
    }

    const results: GeocodingResult[] = await response.json();

    // Filter and validate coordinates
    const formatted = results
      .map((r) => {
        const lat = parseFloat(r.lat);
        const lon = parseFloat(r.lon);
        return { displayName: r.display_name, lat, lon };
      })
      .filter((r) => {
        const validLat = Number.isFinite(r.lat) && r.lat >= -90 && r.lat <= 90;
        const validLon =
          Number.isFinite(r.lon) && r.lon >= -180 && r.lon <= 180;
        return validLat && validLon;
      });

    return NextResponse.json({ results: formatted });
  } catch (error) {
    console.error(
      "Location search error:",
      (error as Error)?.message || "Unknown error",
    );
    return NextResponse.json({ results: [] });
  }
}
