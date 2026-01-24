/**
 * API Response Normalizer
 *
 * Transforms FreeAstrologyAPI responses into the normalized
 * AstrologyProfile schema used by the report engine.
 */

import { AstrologyProfile } from "./types";

/**
 * Expected structure from FreeAstrologyAPI responses.
 * This interface represents what we expect to receive.
 */
interface FreeAstrologyAPIResponse {
  // Basic chart data
  sun_sign?: string;
  moon_sign?: string;
  ascendant?: string;

  // Planetary positions (various possible formats)
  planets?: Array<{
    name: string;
    sign: string;
    house?: number;
  }>;

  // Dasha information
  current_dasha?: string;
  mahadasha?: string;
  upcoming_dashas?: string[];

  // Additional data that might be present
  birth_details?: {
    date: string;
    time?: string;
    place?: string;
  };
}

/**
 * Normalize planet name to lowercase standard format.
 */
function normalizePlanetName(name: string): string {
  const planetMap: Record<string, string> = {
    sun: "sun",
    surya: "sun",
    moon: "moon",
    chandra: "moon",
    mars: "mars",
    mangal: "mars",
    mercury: "mercury",
    budh: "mercury",
    budha: "mercury",
    jupiter: "jupiter",
    guru: "jupiter",
    brihaspati: "jupiter",
    venus: "venus",
    shukra: "venus",
    saturn: "saturn",
    shani: "saturn",
    rahu: "rahu",
    ketu: "ketu",
  };

  const lower = name.toLowerCase().trim();
  return planetMap[lower] || lower;
}

/**
 * Normalize sign name to lowercase standard format.
 */
function normalizeSignName(sign: string): string {
  const signMap: Record<string, string> = {
    aries: "aries",
    mesha: "aries",
    taurus: "taurus",
    vrishabha: "taurus",
    gemini: "gemini",
    mithuna: "gemini",
    cancer: "cancer",
    karka: "cancer",
    leo: "leo",
    simha: "leo",
    virgo: "virgo",
    kanya: "virgo",
    libra: "libra",
    tula: "libra",
    scorpio: "scorpio",
    vrischika: "scorpio",
    sagittarius: "sagittarius",
    dhanu: "sagittarius",
    capricorn: "capricorn",
    makar: "capricorn",
    aquarius: "aquarius",
    kumbha: "aquarius",
    pisces: "pisces",
    meena: "pisces",
  };

  const lower = sign.toLowerCase().trim();
  return signMap[lower] || lower;
}

/**
 * Extract planetary houses from API response.
 */
function extractPlanetaryHouses(
  planets?: FreeAstrologyAPIResponse["planets"],
): Record<string, number> {
  const houses: Record<string, number> = {};

  if (!planets) return houses;

  for (const planet of planets) {
    const name = normalizePlanetName(planet.name);
    if (planet.house && planet.house >= 1 && planet.house <= 12) {
      houses[name] = planet.house;
    }
  }

  return houses;
}

/**
 * Extract planetary signs from API response.
 */
function extractPlanetarySigns(
  planets?: FreeAstrologyAPIResponse["planets"],
): Record<string, string> {
  const signs: Record<string, string> = {};

  if (!planets) return signs;

  for (const planet of planets) {
    const name = normalizePlanetName(planet.name);
    if (planet.sign) {
      signs[name] = normalizeSignName(planet.sign);
    }
  }

  return signs;
}

/**
 * Transform FreeAstrologyAPI response to normalized AstrologyProfile.
 *
 * @param apiResponse - Raw response from FreeAstrologyAPI
 * @param dob - Date of birth (YYYY-MM-DD format)
 * @param baseYear - Year to use as report base (typically current year)
 * @returns Normalized AstrologyProfile
 */
export function normalizeApiResponse(
  apiResponse: FreeAstrologyAPIResponse,
  dob: string,
  baseYear: number = new Date().getFullYear(),
): AstrologyProfile {
  return {
    dob,
    sunSign: normalizeSignName(apiResponse.sun_sign || ""),
    moonSign: normalizeSignName(apiResponse.moon_sign || ""),
    ascendant: normalizeSignName(apiResponse.ascendant || ""),
    planetaryHouses: extractPlanetaryHouses(apiResponse.planets),
    planetarySigns: extractPlanetarySigns(apiResponse.planets),
    currentDasha: apiResponse.current_dasha || apiResponse.mahadasha || "",
    upcomingDashas: apiResponse.upcoming_dashas || [],
    year: baseYear,
  };
}

/**
 * Create a profile directly from structured input.
 * Useful when data is already in the correct format.
 */
export function createProfile(input: {
  dob: string;
  sunSign: string;
  moonSign: string;
  ascendant: string;
  planetaryHouses: Record<string, number>;
  planetarySigns: Record<string, string>;
  currentDasha: string;
  upcomingDashas?: string[];
  year?: number;
  name?: string;
}): AstrologyProfile {
  return {
    dob: input.dob,
    name: input.name,
    sunSign: normalizeSignName(input.sunSign),
    moonSign: normalizeSignName(input.moonSign),
    ascendant: normalizeSignName(input.ascendant),
    planetaryHouses: Object.fromEntries(
      Object.entries(input.planetaryHouses).map(([k, v]) => [
        normalizePlanetName(k),
        v,
      ]),
    ),
    planetarySigns: Object.fromEntries(
      Object.entries(input.planetarySigns).map(([k, v]) => [
        normalizePlanetName(k),
        normalizeSignName(v),
      ]),
    ),
    currentDasha: input.currentDasha,
    upcomingDashas: input.upcomingDashas || [],
    year: input.year || new Date().getFullYear(),
  };
}
