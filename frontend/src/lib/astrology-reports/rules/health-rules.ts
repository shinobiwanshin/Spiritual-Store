/**
 * Health Rules Engine
 */

import { AstrologyProfile, RuleEvaluationResult, YearThemeKey } from "../types";
import {
  HEALTH_DASHA_BLOCKS,
  HEALTH_HOUSE_BLOCKS,
  HEALTH_PERSONAL_YEAR_BLOCKS,
  HEALTH_ADVICE_BLOCKS,
} from "../blocks/health";

export function evaluateHealth(
  profile: AstrologyProfile,
  year: number,
  personalYear: number,
): RuleEvaluationResult {
  const allBlocks: string[] = [];
  let strength: RuleEvaluationResult["strength"] = "moderate";

  // Helper for deterministic randomness
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Personal Year Specific Block (ALWAYS INCLUDE)
  const personalYearBlock = HEALTH_PERSONAL_YEAR_BLOCKS[personalYear];
  if (personalYearBlock) {
    allBlocks.push(personalYearBlock);
  }

  // Collect candidate blocks
  const candidateBlocks: string[] = [];

  const dashaLower = profile.currentDasha.toLowerCase();

  if (dashaLower.includes("saturn")) {
    candidateBlocks.push(HEALTH_DASHA_BLOCKS.saturn_active);
    candidateBlocks.push(HEALTH_ADVICE_BLOCKS.regular_checkups);
  } else if (dashaLower.includes("jupiter")) {
    candidateBlocks.push(HEALTH_DASHA_BLOCKS.jupiter_active);
    strength = "mild";
  } else if (dashaLower.includes("mars")) {
    candidateBlocks.push(HEALTH_DASHA_BLOCKS.mars_active);
    candidateBlocks.push(HEALTH_ADVICE_BLOCKS.exercise_routine);
  } else if (dashaLower.includes("venus")) {
    candidateBlocks.push(HEALTH_DASHA_BLOCKS.venus_active);
  } else if (dashaLower.includes("mercury")) {
    candidateBlocks.push(HEALTH_DASHA_BLOCKS.mercury_active);
    candidateBlocks.push(HEALTH_ADVICE_BLOCKS.mental_wellness);
  } else if (dashaLower.includes("rahu")) {
    candidateBlocks.push(HEALTH_DASHA_BLOCKS.rahu_active);
    candidateBlocks.push(HEALTH_ADVICE_BLOCKS.regular_checkups);
  } else if (dashaLower.includes("ketu")) {
    candidateBlocks.push(HEALTH_DASHA_BLOCKS.ketu_active);
  } else if (dashaLower.includes("sun")) {
    candidateBlocks.push(HEALTH_DASHA_BLOCKS.sun_active);
  } else if (dashaLower.includes("moon")) {
    candidateBlocks.push(HEALTH_DASHA_BLOCKS.moon_active);
    candidateBlocks.push(HEALTH_ADVICE_BLOCKS.stress_management);
  }

  const { planetaryHouses } = profile;

  if (planetaryHouses.saturn === 6) {
    candidateBlocks.push(HEALTH_HOUSE_BLOCKS.saturn_6th);
  }
  if (planetaryHouses.mars === 6) {
    candidateBlocks.push(HEALTH_HOUSE_BLOCKS.mars_6th);
  }
  if (planetaryHouses.jupiter === 6) {
    candidateBlocks.push(HEALTH_HOUSE_BLOCKS.jupiter_6th);
    strength = "mild";
  }
  if (planetaryHouses.sun === 1) {
    candidateBlocks.push(HEALTH_HOUSE_BLOCKS.sun_1st);
    strength = "mild";
  }
  if (planetaryHouses.moon === 1) {
    candidateBlocks.push(HEALTH_HOUSE_BLOCKS.moon_1st);
  }
  if (planetaryHouses.rahu === 6) {
    candidateBlocks.push(HEALTH_HOUSE_BLOCKS.rahu_6th);
  }

  // Select subset based on deterministic sort
  if (candidateBlocks.length > 0) {
    candidateBlocks.sort((a, b) => {
      const seedA = year + a.length;
      const seedB = year + b.length;
      return seededRandom(seedA) - seededRandom(seedB);
    });

    const count = Math.min(candidateBlocks.length, 2);
    for (let i = 0; i < count; i++) {
      allBlocks.push(candidateBlocks[i]);
    }
  }

  return { blocks: allBlocks, strength };
}

export function generateHealthPrediction(result: RuleEvaluationResult): string {
  if (result.blocks.length === 0) {
    return "Health remains stable. Maintain healthy lifestyle habits.";
  }
  return result.blocks.join(" ");
}
