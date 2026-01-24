/**
 * Finance Rules Engine
 *
 * Deterministic rule evaluation for finance predictions.
 */

import { AstrologyProfile, RuleEvaluationResult, YearThemeKey } from "../types";
import {
  FINANCE_DASHA_BLOCKS,
  FINANCE_HOUSE_BLOCKS,
  FINANCE_PERSONAL_YEAR_BLOCKS,
  FINANCE_ADVICE_BLOCKS,
} from "../blocks/finance";

export function evaluateFinance(
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
  const personalYearBlock = FINANCE_PERSONAL_YEAR_BLOCKS[personalYear];
  if (personalYearBlock) allBlocks.push(personalYearBlock);

  // Collect candidate blocks
  const candidateBlocks: string[] = [];

  // Dasha evaluation
  const dashaLower = profile.currentDasha.toLowerCase();

  if (dashaLower.includes("saturn") || dashaLower.includes("shani")) {
    candidateBlocks.push(FINANCE_DASHA_BLOCKS.saturn_active);
  } else if (dashaLower.includes("jupiter") || dashaLower.includes("guru")) {
    candidateBlocks.push(FINANCE_DASHA_BLOCKS.jupiter_active);
    strength = "strong";
  } else if (dashaLower.includes("venus") || dashaLower.includes("shukra")) {
    candidateBlocks.push(FINANCE_DASHA_BLOCKS.venus_active);
    strength = "strong";
  } else if (dashaLower.includes("mercury") || dashaLower.includes("budh")) {
    candidateBlocks.push(FINANCE_DASHA_BLOCKS.mercury_active);
  } else if (dashaLower.includes("rahu")) {
    candidateBlocks.push(FINANCE_DASHA_BLOCKS.rahu_active);
  } else if (dashaLower.includes("ketu")) {
    candidateBlocks.push(FINANCE_DASHA_BLOCKS.ketu_active);
  } else if (dashaLower.includes("mars") || dashaLower.includes("mangal")) {
    candidateBlocks.push(FINANCE_DASHA_BLOCKS.mars_active);
  } else if (dashaLower.includes("sun") || dashaLower.includes("surya")) {
    candidateBlocks.push(FINANCE_DASHA_BLOCKS.sun_active);
  } else if (dashaLower.includes("moon") || dashaLower.includes("chandra")) {
    candidateBlocks.push(FINANCE_DASHA_BLOCKS.moon_active);
  }

  // House-based evaluation
  const { planetaryHouses } = profile;

  if (planetaryHouses.jupiter === 2) {
    candidateBlocks.push(FINANCE_HOUSE_BLOCKS.jupiter_2nd);
    strength = "strong";
  } else if (planetaryHouses.jupiter === 11) {
    candidateBlocks.push(FINANCE_HOUSE_BLOCKS.jupiter_11th);
    strength = "strong";
  }

  if (planetaryHouses.saturn === 2) {
    candidateBlocks.push(FINANCE_HOUSE_BLOCKS.saturn_2nd);
  } else if (planetaryHouses.saturn === 11) {
    candidateBlocks.push(FINANCE_HOUSE_BLOCKS.saturn_11th);
  }

  if (planetaryHouses.venus === 2) {
    candidateBlocks.push(FINANCE_HOUSE_BLOCKS.venus_2nd);
  }

  if (planetaryHouses.mars === 2) {
    candidateBlocks.push(FINANCE_HOUSE_BLOCKS.mars_2nd);
  }

  if (planetaryHouses.mercury === 2) {
    candidateBlocks.push(FINANCE_HOUSE_BLOCKS.mercury_2nd);
  }

  if (planetaryHouses.rahu === 2) {
    candidateBlocks.push(FINANCE_HOUSE_BLOCKS.rahu_2nd);
  }

  if (planetaryHouses.sun === 2) {
    candidateBlocks.push(FINANCE_HOUSE_BLOCKS.sun_2nd);
  }

  if (planetaryHouses.moon === 2) {
    candidateBlocks.push(FINANCE_HOUSE_BLOCKS.moon_2nd);
  }

  // Add advice based on strength
  if (strength === "strong") {
    candidateBlocks.push(FINANCE_ADVICE_BLOCKS.invest_wisely);
  } else if (dashaLower.includes("rahu")) {
    candidateBlocks.push(FINANCE_ADVICE_BLOCKS.avoid_speculation);
  } else {
    candidateBlocks.push(FINANCE_ADVICE_BLOCKS.save_more);
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

export function generateFinancePrediction(
  result: RuleEvaluationResult,
): string {
  if (result.blocks.length === 0) {
    return "Finances remain stable. Continue with prudent financial management.";
  }
  return result.blocks.join(" ");
}
