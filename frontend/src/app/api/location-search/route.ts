import { NextRequest, NextResponse } from "next/server";

const GEOCODING_API = "https://nominatim.openstreetmap.org/search";

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

    const response = await fetch(
      `${GEOCODING_API}?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
      {
        headers: {
          "User-Agent": "AstraSpiritual/1.0",
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json({ results: [] });
    }

    const results: GeocodingResult[] = await response.json();

    const formatted = results.map((r) => ({
      displayName: r.display_name,
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
    }));

    return NextResponse.json({ results: formatted });
  } catch (error) {
    console.error("Location search error:", error);
    return NextResponse.json({ results: [] });
  }
}
