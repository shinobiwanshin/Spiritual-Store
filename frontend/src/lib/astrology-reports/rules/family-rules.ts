/**
 * Family Rules Engine
 */

import { AstrologyProfile, RuleEvaluationResult, YearThemeKey } from "../types";
import {
  FAMILY_DASHA_BLOCKS,
  FAMILY_HOUSE_BLOCKS,
  FAMILY_PERSONAL_YEAR_BLOCKS,
  FAMILY_ADVICE_BLOCKS,
} from "../blocks/family";

export function evaluateFamily(
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
  const personalYearBlock = FAMILY_PERSONAL_YEAR_BLOCKS[personalYear];
  if (personalYearBlock) {
    allBlocks.push(personalYearBlock);
  }

  // Collect candidate blocks
  const candidateBlocks: string[] = [];

  const dashaLower = profile.currentDasha.toLowerCase();

  if (dashaLower.includes("moon")) {
    candidateBlocks.push(FAMILY_DASHA_BLOCKS.moon_active);
    strength = "strong";
  } else if (dashaLower.includes("jupiter")) {
    candidateBlocks.push(FAMILY_DASHA_BLOCKS.jupiter_active);
    strength = "strong";
  } else if (dashaLower.includes("venus")) {
    candidateBlocks.push(FAMILY_DASHA_BLOCKS.venus_active);
  } else if (dashaLower.includes("saturn")) {
    candidateBlocks.push(FAMILY_DASHA_BLOCKS.saturn_active);
    candidateBlocks.push(FAMILY_ADVICE_BLOCKS.support_elders);
  } else if (dashaLower.includes("mars")) {
    candidateBlocks.push(FAMILY_DASHA_BLOCKS.mars_active);
    candidateBlocks.push(FAMILY_ADVICE_BLOCKS.resolve_conflicts);
  } else if (dashaLower.includes("mercury")) {
    candidateBlocks.push(FAMILY_DASHA_BLOCKS.mercury_active);
  } else if (dashaLower.includes("rahu")) {
    candidateBlocks.push(FAMILY_DASHA_BLOCKS.rahu_active);
  } else if (dashaLower.includes("ketu")) {
    candidateBlocks.push(FAMILY_DASHA_BLOCKS.ketu_active);
  } else if (dashaLower.includes("sun")) {
    candidateBlocks.push(FAMILY_DASHA_BLOCKS.sun_active);
  }

  const { planetaryHouses } = profile;

  if (planetaryHouses.jupiter === 4) {
    candidateBlocks.push(FAMILY_HOUSE_BLOCKS.jupiter_4th);
    strength = "strong";
  }
  if (planetaryHouses.moon === 4) {
    candidateBlocks.push(FAMILY_HOUSE_BLOCKS.moon_4th);
    strength = "strong";
  }
  if (planetaryHouses.venus === 4) {
    candidateBlocks.push(FAMILY_HOUSE_BLOCKS.venus_4th);
  }
  if (planetaryHouses.saturn === 4) {
    candidateBlocks.push(FAMILY_HOUSE_BLOCKS.saturn_4th);
  }
  if (planetaryHouses.mars === 4) {
    candidateBlocks.push(FAMILY_HOUSE_BLOCKS.mars_4th);
  }
  if (planetaryHouses.sun === 4) {
    candidateBlocks.push(FAMILY_HOUSE_BLOCKS.sun_4th);
  }

  candidateBlocks.push(FAMILY_ADVICE_BLOCKS.quality_time);

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

export function generateFamilyPrediction(result: RuleEvaluationResult): string {
  if (result.blocks.length === 0) {
    return "Family life remains harmonious. Continue nurturing relationships.";
  }
  return result.blocks.join(" ");
}
