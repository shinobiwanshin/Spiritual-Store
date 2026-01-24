/**
 * Love Rules Engine
 */

import { AstrologyProfile, RuleEvaluationResult, YearThemeKey } from "../types";
import {
  LOVE_DASHA_BLOCKS,
  LOVE_HOUSE_BLOCKS,
  LOVE_PERSONAL_YEAR_BLOCKS,
  LOVE_ADVICE_BLOCKS,
  MARRIAGE_TIMING_BLOCKS,
} from "../blocks/love";

export function evaluateLove(
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
  const personalYearBlock = LOVE_PERSONAL_YEAR_BLOCKS[personalYear];
  if (personalYearBlock) {
    allBlocks.push(personalYearBlock);
  }

  // Collect candidate blocks
  const candidateBlocks: string[] = [];

  const dashaLower = profile.currentDasha.toLowerCase();

  if (dashaLower.includes("venus")) {
    candidateBlocks.push(LOVE_DASHA_BLOCKS.venus_active);
    candidateBlocks.push(MARRIAGE_TIMING_BLOCKS.favorable);
    strength = "strong";
  } else if (dashaLower.includes("jupiter")) {
    candidateBlocks.push(LOVE_DASHA_BLOCKS.jupiter_active);
    candidateBlocks.push(MARRIAGE_TIMING_BLOCKS.favorable);
    strength = "strong";
  } else if (dashaLower.includes("moon")) {
    candidateBlocks.push(LOVE_DASHA_BLOCKS.moon_active);
  } else if (dashaLower.includes("saturn")) {
    candidateBlocks.push(LOVE_DASHA_BLOCKS.saturn_active);
    candidateBlocks.push(MARRIAGE_TIMING_BLOCKS.patience_needed);
  } else if (dashaLower.includes("mars")) {
    candidateBlocks.push(LOVE_DASHA_BLOCKS.mars_active);
    candidateBlocks.push(LOVE_ADVICE_BLOCKS.patience);
  } else if (dashaLower.includes("mercury")) {
    candidateBlocks.push(LOVE_DASHA_BLOCKS.mercury_active);
    candidateBlocks.push(LOVE_ADVICE_BLOCKS.open_communication);
  } else if (dashaLower.includes("rahu")) {
    candidateBlocks.push(LOVE_DASHA_BLOCKS.rahu_active);
    candidateBlocks.push(MARRIAGE_TIMING_BLOCKS.moderate);
  } else if (dashaLower.includes("ketu")) {
    candidateBlocks.push(LOVE_DASHA_BLOCKS.ketu_active);
  } else if (dashaLower.includes("sun")) {
    candidateBlocks.push(LOVE_DASHA_BLOCKS.sun_active);
  }

  const { planetaryHouses } = profile;

  if (planetaryHouses.venus === 7) {
    candidateBlocks.push(LOVE_HOUSE_BLOCKS.venus_7th);
    strength = "strong";
  } else if (planetaryHouses.venus === 5) {
    candidateBlocks.push(LOVE_HOUSE_BLOCKS.venus_5th);
  }

  if (planetaryHouses.jupiter === 7) {
    candidateBlocks.push(LOVE_HOUSE_BLOCKS.jupiter_7th);
    strength = "strong";
  }

  if (planetaryHouses.mars === 7) {
    candidateBlocks.push(LOVE_HOUSE_BLOCKS.mars_7th);
  }

  if (planetaryHouses.saturn === 7) {
    candidateBlocks.push(LOVE_HOUSE_BLOCKS.saturn_7th);
  }

  if (planetaryHouses.sun === 7) {
    candidateBlocks.push(LOVE_HOUSE_BLOCKS.sun_7th);
  }

  if (planetaryHouses.moon === 7) {
    candidateBlocks.push(LOVE_HOUSE_BLOCKS.moon_7th);
  }

  if (planetaryHouses.rahu === 7) {
    candidateBlocks.push(LOVE_HOUSE_BLOCKS.rahu_7th);
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

export function generateLovePrediction(result: RuleEvaluationResult): string {
  if (result.blocks.length === 0) {
    return "Relationship matters progress steadily. Focus on deepening emotional connections.";
  }
  return result.blocks.join(" ");
}
