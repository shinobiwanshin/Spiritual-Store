/**
 * Astrology Report Engine - Year Themes
 *
 * Deterministic year theme mapping based on numerology and dasha influence.
 * Each calendar year maps to exactly one theme.
 */

import { YearTheme, YearThemeKey } from "./types";

// ============================================
// Year Theme Definitions
// ============================================

export const YEAR_THEMES: Record<YearThemeKey, YearTheme> = {
  foundation: {
    key: "foundation",
    tone: "slow, patient, stabilizing",
    keywords: ["patience", "discipline", "consistency", "building blocks"],
    overview:
      "This year emphasizes building strong foundations. Progress may feel slow, " +
      "but the work you put in now creates lasting stability. Focus on establishing " +
      "routines, strengthening relationships, and making careful, considered decisions.",
  },

  growth: {
    key: "growth",
    tone: "expansive, opportunity-driven",
    keywords: ["new beginnings", "learning", "expansion", "opportunities"],
    overview:
      "A year of expansion and new possibilities. You may encounter fresh opportunities " +
      "for growth in multiple areas of life. This is an excellent time for learning, " +
      "starting new ventures, and stepping outside your comfort zone.",
  },

  intensity: {
    key: "intensity",
    tone: "demanding, execution-focused",
    keywords: ["responsibility", "hard work", "completion", "achievement"],
    overview:
      "This year demands focused effort and dedication. You will be called upon to " +
      "deliver results and take on significant responsibilities. Hard work will be " +
      "recognized, and major achievements are possible through sustained commitment.",
  },

  transition: {
    key: "transition",
    tone: "transformative, shifting",
    keywords: ["change", "adaptation", "endings", "new directions"],
    overview:
      "A year of meaningful transitions and transformations. Some chapters of your life " +
      "may close while new ones begin. Embrace change as a natural part of growth, and " +
      "remain flexible as circumstances evolve around you.",
  },

  harvest: {
    key: "harvest",
    tone: "rewarding, culminating",
    keywords: ["rewards", "recognition", "success", "fruition"],
    overview:
      "This is a year of reaping what you have sown. Past efforts come to fruition, " +
      "and recognition for your work arrives naturally. Enjoy the rewards of your " +
      "dedication while planning wisely for the cycles ahead.",
  },
};

// ============================================
// Year Theme Calculation
// ============================================

/**
 * Calculate numerology year number from a calendar year.
 * Sum all digits until single digit (1-9).
 */
function calculateNumerologyYear(year: number): number {
  let sum = year;
  while (sum > 9) {
    sum = String(sum)
      .split("")
      .reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum;
}

/**
 * Map numerology number to base theme.
 * Based on traditional numerology associations.
 */
function numerologyToTheme(num: number): YearThemeKey {
  const mapping: Record<number, YearThemeKey> = {
    1: "growth", // New beginnings
    2: "foundation", // Cooperation, patience
    3: "growth", // Creativity, expansion
    4: "foundation", // Structure, discipline
    5: "transition", // Change, freedom
    6: "harvest", // Responsibility, rewards
    7: "foundation", // Reflection, inner work
    8: "intensity", // Power, achievement
    9: "harvest", // Completion, fulfillment
  };
  return mapping[num] || "foundation";
}

/**
 * Adjust theme based on current dasha (planetary period).
 * Certain dashas modify the base theme.
 */
function adjustThemeByDasha(
  baseTheme: YearThemeKey,
  currentDasha: string,
): YearThemeKey {
  const dashaLower = currentDasha.toLowerCase();

  // Saturn dasha typically adds intensity/foundation energy
  if (dashaLower.includes("saturn") || dashaLower.includes("shani")) {
    if (baseTheme === "growth") return "intensity";
    if (baseTheme === "harvest") return "intensity";
  }

  // Jupiter dasha enhances growth/harvest energy
  if (dashaLower.includes("jupiter") || dashaLower.includes("guru")) {
    // Jupiter creates expansion even in foundation years, but let's keep the distinct flavor
    // if (baseTheme === "foundation") return "growth";
    if (baseTheme === "intensity") return "harvest";
  }

  // Rahu/Ketu often bring transitions
  if (dashaLower.includes("rahu") || dashaLower.includes("ketu")) {
    if (baseTheme === "foundation") return "transition";
  }

  // Mars adds intensity
  if (dashaLower.includes("mars") || dashaLower.includes("mangal")) {
    if (baseTheme === "growth") return "intensity";
  }

  return baseTheme;
}

/**
 * Get the theme for a specific year given the current dasha.
 * This is the main public function for theme calculation.
 *
 * @param year - Calendar year (e.g., 2026)
 * @param currentDasha - Current mahadasha name
 * @returns The determined theme for that year
 */
export function getYearTheme(year: number, currentDasha: string): YearTheme {
  const numerologyNum = calculateNumerologyYear(year);
  const baseTheme = numerologyToTheme(numerologyNum);
  const adjustedTheme = adjustThemeByDasha(baseTheme, currentDasha);

  return YEAR_THEMES[adjustedTheme];
}

/**
 * Get themes for multiple years at once.
 * Useful for multi-year report generation.
 */
export function getYearThemes(
  startYear: number,
  duration: number,
  currentDasha: string,
): Map<number, YearTheme> {
  const themes = new Map<number, YearTheme>();

  for (let i = 0; i < duration; i++) {
    const year = startYear + i;
    themes.set(year, getYearTheme(year, currentDasha));
  }

  return themes;
}
