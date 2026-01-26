import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { rashiReports } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import dns from "node:dns";
import createDOMPurify from "dompurify";
import { parseHTML } from "linkedom";

const ASTROLOGY_API_BASE = "https://json.freeastrologyapi.com";
const GEOCODING_API = "https://nominatim.openstreetmap.org/search";

// Sign number to name mapping
const SIGN_NAMES: Record<number, string> = {
  1: "Aries",
  2: "Taurus",
  3: "Gemini",
  4: "Cancer",
  5: "Leo",
  6: "Virgo",
  7: "Libra",
  8: "Scorpio",
  9: "Sagittarius",
  10: "Capricorn",
  11: "Aquarius",
  12: "Pisces",
};

// Nakshatra mapping (based on degree in sign)
const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface AstrologyRequest {
  location: string;
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds?: number;
  name?: string;
}

interface RawPlanet {
  name: string;
  fullDegree: number;
  normDegree: number;
  isRetro: string;
  current_sign: number;
}

interface TransformedPlanet {
  name: string;
  fullDegree: number;
  normDegree: number;
  isRetro: string;
  sign: string;
  nakshatra: string;
  house: number;
}

// Calculate nakshatra from full degree
function getNakshatra(fullDegree: number): string {
  // Each nakshatra spans 13°20' (13.333... degrees)
  const nakshatraIndex = Math.floor(fullDegree / (360 / 27));
  return NAKSHATRAS[nakshatraIndex] || "Unknown";
}

// Transform raw planet data to usable format
function transformPlanets(rawOutput: unknown): TransformedPlanet[] {
  if (!rawOutput) return [];

  // The API returns array with first element containing numbered keys
  const planetsObj = Array.isArray(rawOutput) ? rawOutput[0] : rawOutput;
  if (!planetsObj || typeof planetsObj !== "object") return [];

  const planets: TransformedPlanet[] = [];
  const ascendantSign =
    (planetsObj as Record<string, RawPlanet>)["0"]?.current_sign || 1;

  // Iterate through numbered keys (0-12 are planets)
  for (let i = 0; i <= 12; i++) {
    const key = String(i);
    const planet = (planetsObj as Record<string, RawPlanet>)[key];

    if (planet && planet.name && planet.name !== "ayanamsa") {
      const signNumber = planet.current_sign || 1;
      // Calculate house based on sign relative to ascendant
      const house = ((signNumber - ascendantSign + 12) % 12) + 1;

      planets.push({
        name: planet.name,
        fullDegree: planet.fullDegree,
        normDegree: planet.normDegree,
        isRetro: planet.isRetro,
        sign: SIGN_NAMES[signNumber] || `Sign ${signNumber}`,
        nakshatra: getNakshatra(planet.fullDegree),
        house: planet.name === "Ascendant" ? 1 : house,
      });
    }
  }

  return planets;
}

// Geocode location to lat/long using OpenStreetMap Nominatim
async function geocodeLocation(
  location: string,
): Promise<{ lat: number; lon: number; displayName: string } | null> {
  try {
    const response = await fetch(
      `${GEOCODING_API}?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "AstraSpiritual/1.0",
        },
      },
    );

    if (!response.ok) return null;

    const results: GeocodingResult[] = await response.json();
    if (results.length === 0) return null;

    return {
      lat: parseFloat(results[0].lat),
      lon: parseFloat(results[0].lon),
      displayName: results[0].display_name,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

// Get timezone offset based on longitude
function getTimezoneOffset(longitude: number, displayName: string): number {
  if (displayName.toLowerCase().includes("india")) {
    return 5.5;
  }
  return Math.round((longitude / 15) * 2) / 2;
}

// Helper to securely fetch SVG content
export async function fetchSvgContent(
  url: string | null,
): Promise<string | null> {
  if (!url) return null;

  // 1. URL Validation (Basic SSRF protection + DNS Check)
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      console.warn("Skipping non-http URL for SVG:", url);
      return url; // Return original URL if invalid protocol
    }

    // Hostname validation
    const hostname = parsedUrl.hostname;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname === "169.254.169.254"
    ) {
      console.warn("Blocked potentially dangerous hostname:", hostname);
      return url;
    }

    // DNS Resolution Check
    const addresses = await dns.promises.resolve(hostname);
    const blockedRanges = [
      /^127\./, // 127.0.0.0/8
      /^10\./, // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
      /^192\.168\./, // 192.168.0.0/16
      /^169\.254\./, // 169.254.0.0/16
      /^fc00:/, // Unique Local
      /^fe80:/, // Link Local
      /^::1$/, // Loopback
    ];

    for (const ip of addresses) {
      if (blockedRanges.some((regex) => regex.test(ip))) {
        console.warn("Blocked private IP address:", ip);
        return url;
      }
    }
  } catch {
    return url;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "image/svg+xml, */*",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Failed to fetch SVG from ${url}: ${response.status}`);
      return url; // Fallback to URL
    }

    const contentType = response.headers.get("content-type");
    if (
      contentType &&
      !contentType.includes("svg") &&
      !contentType.includes("xml")
    ) {
      console.warn(`Invalid content type at ${url}: ${contentType}`);
      return url;
    }

    // 2. Size Limit and Streaming (MAX_SIZE 100KB)
    const MAX_SIZE = 100 * 1024;
    const bodyFn = response.body;

    if (!bodyFn) {
      // Fallback if no body stream
      console.warn("No response body stream available");
      return url;
    }

    const reader = bodyFn.getReader();
    let receivedLength = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      receivedLength += value.length;
      if (receivedLength > MAX_SIZE) {
        console.warn(`SVG too large from ${url}: Exceeded ${MAX_SIZE} bytes`);
        reader.cancel();
        return url;
      }
      chunks.push(value);
    }

    // Combine chunks
    const chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }

    const text = new TextDecoder("utf-8").decode(chunksAll);

    // 4. Sanitization using dompurify + linkedom
    // Create a mock window for DOMPurify using linkedom
    const { window } = parseHTML("<!DOCTYPE html><html><body></body></html>");
    const purify = createDOMPurify(window as unknown as any);

    // Sanitize specifically for SVG
    const clean = purify.sanitize(text, { USE_PROFILES: { svg: true } });

    return clean;
  } catch (error) {
    console.warn(`Error fetching SVG content from ${url}:`, error);
    return url;
  }
}

// GET - Fetch user's saved rashi report
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const report = await db
      .select()
      .from(rashiReports)
      .where(eq(rashiReports.userId, userId))
      .orderBy(desc(rashiReports.createdAt))
      .limit(1);

    if (report.length === 0) {
      return NextResponse.json({ report: null });
    }

    return NextResponse.json({ report: report[0] });
  } catch (error) {
    console.error("GET rashi report error:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 },
    );
  }
}

// POST - Generate and save new rashi report
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    // Require authentication to generate reports
    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to generate your Kundali" },
        { status: 401 },
      );
    }

    const apiKey = process.env.ASTROLOGY_API;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Astrology API not configured" },
        { status: 500 },
      );
    }

    const body: AstrologyRequest = await request.json();
    const {
      location,
      year,
      month,
      date,
      hours,
      minutes,
      seconds = 0,
      name,
    } = body;

    // Validate required fields
    if (
      !location ||
      !year ||
      !month ||
      !date ||
      hours === undefined ||
      minutes === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Geocode the location
    const geoData = await geocodeLocation(location);
    if (!geoData) {
      return NextResponse.json(
        {
          error: "Could not find location. Please try a more specific address.",
        },
        { status: 400 },
      );
    }

    const timezone = getTimezoneOffset(geoData.lon, geoData.displayName);

    const astrologyPayload = {
      year,
      month,
      date,
      hours,
      minutes,
      seconds,
      latitude: geoData.lat,
      longitude: geoData.lon,
      timezone,
      config: {
        observation_point: "topocentric",
        ayanamsha: "lahiri",
      },
    };

    // Fetch horoscope chart URL
    const chartResponse = await fetch(
      `${ASTROLOGY_API_BASE}/horoscope-chart-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(astrologyPayload),
      },
    );

    if (!chartResponse.ok) {
      console.error("Chart API error:", await chartResponse.text());
      return NextResponse.json(
        { error: "Failed to generate chart" },
        { status: 500 },
      );
    }

    const chartData = await chartResponse.json();
    let rasiChart = chartData.output || chartData;

    // Securely fetch Rasi chart SVG
    rasiChart = await fetchSvgContent(rasiChart);

    // Fetch planetary positions
    const planetsResponse = await fetch(`${ASTROLOGY_API_BASE}/planets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(astrologyPayload),
    });

    let planetsData: TransformedPlanet[] = [];
    let moonSign: string | null = null;
    let nakshatra: string | null = null;

    if (planetsResponse.ok) {
      const planetsResult = await planetsResponse.json();
      const rawPlanets = planetsResult.output || planetsResult;

      // Transform the raw data
      planetsData = transformPlanets(rawPlanets);

      if (planetsData.length === 0) {
        console.error(
          "Planets transformation resulted in empty array. Raw data:",
          JSON.stringify(rawPlanets),
        );
      }

      // Extract moon data
      const moonData = planetsData.find((p) => p.name === "Moon");
      if (moonData) {
        moonSign = moonData.sign;
        nakshatra = moonData.nakshatra;
      }
    } else {
      console.error("Planets API failed:", await planetsResponse.text());
    }

    // Fetch Navamsa chart
    const navamsaResponse = await fetch(
      `${ASTROLOGY_API_BASE}/navamsa-chart-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(astrologyPayload),
      },
    );

    let navamsaChartUrl = null;
    if (navamsaResponse.ok) {
      const navamsaData = await navamsaResponse.json();
      navamsaChartUrl = navamsaData.output || navamsaData;

      // Securely fetch Navamsa chart SVG
      navamsaChartUrl = await fetchSvgContent(navamsaChartUrl);
    }

    // Save to database if user is authenticated
    let reportId: string | null = null;
    if (userId) {
      const birthDate = `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
      const birthTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      const [inserted] = await db
        .insert(rashiReports)
        .values({
          userId,
          name: name || null,
          birthDate,
          birthTime,
          birthLocation: geoData.displayName,
          latitude: String(geoData.lat),
          longitude: String(geoData.lon),
          timezone: String(timezone),
          moonSign,
          nakshatra,
          rasiChartUrl: typeof rasiChart === "string" ? rasiChart : null,
          navamsaChartUrl:
            typeof navamsaChartUrl === "string" ? navamsaChartUrl : null,
          planetsData,
        })
        .returning({ id: rashiReports.id });

      reportId = inserted?.id || null;
    }

    return NextResponse.json({
      success: true,
      reportId,
      location: {
        input: location,
        resolved: geoData.displayName,
        latitude: geoData.lat,
        longitude: geoData.lon,
        timezone,
      },
      birthDetails: {
        year,
        month,
        date,
        hours,
        minutes,
        seconds,
      },
      charts: {
        rasi: rasiChart,
        navamsa: navamsaChartUrl,
      },
      planets: planetsData,
      moonSign,
      nakshatra,
    });
  } catch (error) {
    console.error("Astrology API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
