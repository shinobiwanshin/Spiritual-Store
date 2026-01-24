/**
 * Yearly Report Builder
 *
 * Builds a single year's predictions by orchestrating
 * all rule evaluators and combining their outputs.
 */

import { AstrologyProfile, YearlyReport } from "./types";
import { getYearTheme } from "./themes";
import { evaluateCareer, generateCareerPrediction } from "./rules/career-rules";
import {
  evaluateFinance,
  generateFinancePrediction,
} from "./rules/finance-rules";
import { evaluateHealth, generateHealthPrediction } from "./rules/health-rules";
import { evaluateFamily, generateFamilyPrediction } from "./rules/family-rules";
import { evaluateLove, generateLovePrediction } from "./rules/love-rules";
import { calculatePersonalYearPrediction } from "./numerology";

/**
 * Generate advice based on the year's theme and dominant factors.
 */
function generateAdvice(
  profile: AstrologyProfile,
  year: number,
  themeKey: string,
): string {
  const adviceBlocks: string[] = [];

  // Base advice on theme
  switch (themeKey) {
    case "foundation":
      adviceBlocks.push("Focus on building sustainable routines and habits.");
      adviceBlocks.push(
        "Patience and consistency will yield the best results this year.",
      );
      break;
    case "growth":
      adviceBlocks.push("Embrace new opportunities with an open mind.");
      adviceBlocks.push(
        "This is an excellent year for learning and expansion.",
      );
      break;
    case "intensity":
      adviceBlocks.push("Channel your energy into focused, purposeful action.");
      adviceBlocks.push(
        "Hard work during this period creates lasting achievements.",
      );
      break;
    case "transition":
      adviceBlocks.push("Stay flexible as circumstances evolve around you.");
      adviceBlocks.push("Embrace change as an opportunity for renewal.");
      break;
    case "harvest":
      adviceBlocks.push("Enjoy the fruits of your past efforts.");
      adviceBlocks.push(
        "Express gratitude while planning wisely for future cycles.",
      );
      break;
  }

  // Add dasha-specific advice
  const dashaLower = profile.currentDasha.toLowerCase();
  if (dashaLower.includes("saturn")) {
    adviceBlocks.push("Maintain discipline and respect responsibilities.");
  } else if (dashaLower.includes("jupiter")) {
    adviceBlocks.push("Seek wisdom through teachers and ethical guidance.");
  } else if (dashaLower.includes("mars")) {
    adviceBlocks.push(
      "Channel energy constructively; avoid unnecessary conflicts.",
    );
  } else if (dashaLower.includes("venus")) {
    adviceBlocks.push("Cultivate beauty and harmony in your surroundings.");
  } else if (dashaLower.includes("mercury")) {
    adviceBlocks.push("Improve communication skills and stay mentally active.");
  }

  return adviceBlocks.join(" ");
}

/**
 * Build a complete yearly report for a single year.
 * This is the core function that assembles all predictions.
 */
export function buildYearlyReport(
  profile: AstrologyProfile,
  year: number,
): YearlyReport {
  // Get the theme for this year
  const theme = getYearTheme(year, profile.currentDasha);

  // Calculate Personal Year Numerology
  const numerology = calculatePersonalYearPrediction(profile.dob, year);

  // Evaluate each life area
  // Evaluate each life area
  // We pass numerology.personalYear instead of theme.key
  // to ensure predictions are specific to the 1-9 year cycle.
  const careerResult = evaluateCareer(profile, year, numerology.personalYear);
  const financeResult = evaluateFinance(profile, year, numerology.personalYear);
  const healthResult = evaluateHealth(profile, year, numerology.personalYear);
  const familyResult = evaluateFamily(profile, year, numerology.personalYear);
  const loveResult = evaluateLove(profile, year, numerology.personalYear);

  // Generate predictions from evaluation results
  const career = generateCareerPrediction(careerResult);
  const finance = generateFinancePrediction(financeResult);
  const health = generateHealthPrediction(healthResult);
  const family = generateFamilyPrediction(familyResult);
  const love = generateLovePrediction(loveResult);

  // Generate advice
  const advice = generateAdvice(profile, year, theme.key);

  // Combine Universal Theme overview with Personal Year context for uniqueness
  const overview = `${theme.overview} This period aligns with a Personal Year of "${numerology.theme}" energy.`;

  return {
    year,
    theme: theme.key,
    overview,

    career,
    finance,
    health,
    family,
    love,
    advice,
    numerology,
  };
}
