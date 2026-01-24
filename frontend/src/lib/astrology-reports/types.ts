/**
 * Astrology Report Engine - Core Type Definitions
 *
 * These types define the normalized schema for astrology data,
 * ensuring business logic is independent of external API structure.
 */

// ============================================
// Input Types (Normalized from FreeAstrologyAPI)
// ============================================

/**
 * Normalized astrology profile - the single source of truth
 * for all report generation logic.
 */
export type AstrologyProfile = {
  /** Date of birth in YYYY-MM-DD format */
  dob: string;

  /** Full name (for numerology) */
  name?: string;

  /** Sun sign (Aries, Taurus, etc.) */
  sunSign: string;

  /** Moon sign */
  moonSign: string;

  /** Ascendant/Rising sign */
  ascendant: string;

  /** Map of planet name to house number (1-12) */
  planetaryHouses: Record<string, number>;

  /** Map of planet name to zodiac sign */
  planetarySigns: Record<string, string>;

  /** Current Mahadasha (major period) */
  currentDasha: string;

  /** List of upcoming dashas in order */
  upcomingDashas: string[];

  /** Base year for report generation */
  year: number;
};

/**
 * Supported report durations
 */
export type ReportDuration = 1 | 3 | 5;

// ============================================
// Output Types (Report Structure)
// ============================================

/**
 * A single year's predictions across all life areas
 */
export type YearlyReport = {
  /** The calendar year */
  year: number;

  /** Year theme identifier */
  theme: YearThemeKey;

  /** Overview paragraph (theme-based) */
  overview: string;

  /** Career predictions */
  career: string;

  /** Finance predictions */
  finance: string;

  /** Health predictions */
  health: string;

  /** Family predictions */
  family: string;

  /** Love/Relationship predictions */
  love: string;

  /** Practical advice for the year */
  advice: string;

  /** Year-specific Numerology */
  numerology?: YearlyNumerology;
};

/**
 * Phase grouping for 5-year reports
 */
export type ReportPhase = {
  name: string;
  years: number[];
  summary: string;
};

/**
 * Final report output structure
 */
export type AstrologyReport = {
  /** Report duration label */
  duration: string;

  /** Years covered */
  years: number[];

  /** Individual yearly reports */
  reports: YearlyReport[];

  /** Phase groupings (for 5-year reports) */
  phases?: ReportPhase[];

  /** Generated timestamp */
  generatedAt: string;

  /** Legal disclaimer */
  disclaimer: string;

  /** Core Numerology Profile (Lifetime) */
  numerology?: {
    lifePath: { number: number; meaning: string };
    destiny: { number: number; meaning: string }; // Name Number
    soulUrge: { number: number; meaning: string };
    personality: { number: number; meaning: string };
    birthDate: { number: number; meaning: string };
  };

  /** Zodiac Relations (Friends/Enemies) */
  zodiacRelations?: {
    friendSigns: { sign: string; description: string }[];
    enemySigns: { sign: string; description: string }[];
  };
};

/**
 * Yearly Numerology Prediction
 */
export type YearlyNumerology = {
  personalYear: number;
  prediction: string;
  theme: string;
  element: "Fire" | "Earth" | "Air" | "Water"; // For zodiac emphasis
};

export type ExtendedYearlyReport = YearlyReport & {
  numerology?: YearlyNumerology;
};

// ============================================
// Theme Types
// ============================================

export type YearThemeKey =
  | "foundation"
  | "growth"
  | "intensity"
  | "transition"
  | "harvest";

export type YearTheme = {
  key: YearThemeKey;
  tone: string;
  keywords: string[];
  overview: string;
};

// ============================================
// Rule Engine Types
// ============================================

/**
 * Result of evaluating rules for a life area
 */
export type RuleEvaluationResult = {
  blocks: string[];
  strength: "strong" | "moderate" | "mild";
};

/**
 * Function signature for rule evaluators
 */
export type RuleEvaluator = (
  profile: AstrologyProfile,
  year: number,
) => RuleEvaluationResult;

// ============================================
// Constants
// ============================================

export const PLANETS = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
  "rahu",
  "ketu",
] as const;

export type Planet = (typeof PLANETS)[number];

export const ZODIAC_SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

export const DISCLAIMER =
  "Predictions are based on Vedic astrology principles and are advisory in nature. " +
  "They should not be considered as guarantees or substitutes for professional advice. " +
  "Individual results may vary based on personal actions and circumstances.";
