/**
 * Career Rules Engine
 *
 * Deterministic rule evaluation for career predictions.
 * Selects applicable blocks based on planetary positions.
 */

import { AstrologyProfile, RuleEvaluationResult, YearThemeKey } from "../types";
import {
  CAREER_DASHA_BLOCKS,
  CAREER_HOUSE_BLOCKS,
  CAREER_SIGN_BLOCKS,
  CAREER_PERSONAL_YEAR_BLOCKS,
} from "../blocks/career";

/**
 * Evaluate career rules for a given profile and year.
 * Returns applicable text blocks and strength indicator.
 */
export function evaluateCareer(
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

  // 1. Add Personal Year Specific Block (ALWAYS INCLUDE)
  // This ensures specific advice per year (1-9 cycle) and avoids repetition
  const personalYearBlock = CAREER_PERSONAL_YEAR_BLOCKS[personalYear];
  if (personalYearBlock) {
    allBlocks.push(personalYearBlock);
  }

  // 2. Collect ALL other potential blocks first
  const candidateBlocks: string[] = [];

  // 2. Check current dasha
  const dashaLower = profile.currentDasha.toLowerCase();

  if (dashaLower.includes("saturn") || dashaLower.includes("shani")) {
    candidateBlocks.push(CAREER_DASHA_BLOCKS.saturn_active);
    strength = "strong";
  } else if (dashaLower.includes("jupiter") || dashaLower.includes("guru")) {
    candidateBlocks.push(CAREER_DASHA_BLOCKS.jupiter_active);
    strength = "strong";
  } else if (dashaLower.includes("mars") || dashaLower.includes("mangal")) {
    candidateBlocks.push(CAREER_DASHA_BLOCKS.mars_active);
  } else if (dashaLower.includes("venus") || dashaLower.includes("shukra")) {
    candidateBlocks.push(CAREER_DASHA_BLOCKS.venus_active);
  } else if (dashaLower.includes("mercury") || dashaLower.includes("budh")) {
    candidateBlocks.push(CAREER_DASHA_BLOCKS.mercury_active);
  } else if (dashaLower.includes("rahu")) {
    candidateBlocks.push(CAREER_DASHA_BLOCKS.rahu_active);
  } else if (dashaLower.includes("ketu")) {
    candidateBlocks.push(CAREER_DASHA_BLOCKS.ketu_active);
  } else if (dashaLower.includes("sun") || dashaLower.includes("surya")) {
    candidateBlocks.push(CAREER_DASHA_BLOCKS.sun_active);
  } else if (dashaLower.includes("moon") || dashaLower.includes("chandra")) {
    candidateBlocks.push(CAREER_DASHA_BLOCKS.moon_active);
  }

  // 3. Check planetary houses for career-relevant positions
  const { planetaryHouses, planetarySigns } = profile;

  // Saturn in key houses
  if (planetaryHouses.saturn === 10) {
    candidateBlocks.push(CAREER_HOUSE_BLOCKS.saturn_10th);
    strength = "strong";
  } else if (planetaryHouses.saturn === 1) {
    candidateBlocks.push(CAREER_HOUSE_BLOCKS.saturn_1st);
  } else if (planetaryHouses.saturn === 6) {
    candidateBlocks.push(CAREER_HOUSE_BLOCKS.saturn_6th);
  }

  // Jupiter in key houses
  if (planetaryHouses.jupiter === 10) {
    candidateBlocks.push(CAREER_HOUSE_BLOCKS.jupiter_10th);
    strength = "strong";
  } else if (planetaryHouses.jupiter === 9) {
    candidateBlocks.push(CAREER_HOUSE_BLOCKS.jupiter_9th);
  } else if (planetaryHouses.jupiter === 2) {
    candidateBlocks.push(CAREER_HOUSE_BLOCKS.jupiter_2nd);
  }

  // Mars in 10th house
  if (planetaryHouses.mars === 10) {
    candidateBlocks.push(CAREER_HOUSE_BLOCKS.mars_10th);
  } else if (planetaryHouses.mars === 6) {
    candidateBlocks.push(CAREER_HOUSE_BLOCKS.mars_6th);
  }

  // Venus in 10th house
  if (planetaryHouses.venus === 10) {
    candidateBlocks.push(CAREER_HOUSE_BLOCKS.venus_10th);
  }

  // Sun in 10th house
  if (planetaryHouses.sun === 10) {
    candidateBlocks.push(CAREER_HOUSE_BLOCKS.sun_10th);
    strength = "strong";
  }

  // Mercury in 10th house
  if (planetaryHouses.mercury === 10) {
    candidateBlocks.push(CAREER_HOUSE_BLOCKS.mercury_10th);
  }

  // Rahu in 10th house
  if (planetaryHouses.rahu === 10) {
    candidateBlocks.push(CAREER_HOUSE_BLOCKS.rahu_10th);
  }

  // 4. Check sign-based placements
  const saturnSign = planetarySigns.saturn?.toLowerCase();
  if (saturnSign === "capricorn" || saturnSign === "makar") {
    candidateBlocks.push(CAREER_SIGN_BLOCKS.saturn_capricorn);
  } else if (saturnSign === "aquarius" || saturnSign === "kumbha") {
    candidateBlocks.push(CAREER_SIGN_BLOCKS.saturn_aquarius);
  }

  const jupiterSign = planetarySigns.jupiter?.toLowerCase();
  if (jupiterSign === "sagittarius" || jupiterSign === "dhanu") {
    candidateBlocks.push(CAREER_SIGN_BLOCKS.jupiter_sagittarius);
  } else if (jupiterSign === "pisces" || jupiterSign === "meena") {
    candidateBlocks.push(CAREER_SIGN_BLOCKS.jupiter_pisces);
  }

  const marsSign = planetarySigns.mars?.toLowerCase();
  if (marsSign === "aries" || marsSign === "mesha") {
    candidateBlocks.push(CAREER_SIGN_BLOCKS.mars_aries);
  } else if (marsSign === "scorpio" || marsSign === "vrischika") {
    candidateBlocks.push(CAREER_SIGN_BLOCKS.mars_scorpio);
  }

  // 5. Select subset based on deterministic sort
  // This ensures that different years (with different 'year' values)
  // will prioritize different blocks if multiple are active.
  if (candidateBlocks.length > 0) {
    candidateBlocks.sort((a, b) => {
      const seedA = year + a.length;
      const seedB = year + b.length;
      return seededRandom(seedA) - seededRandom(seedB);
    });

    // Take top 2-3 blocks depending on availability
    const count = Math.min(candidateBlocks.length, 2);
    for (let i = 0; i < count; i++) {
      allBlocks.push(candidateBlocks[i]);
    }
  }

  // If we have very few blocks (e.g. just theme), ensure we have something
  if (allBlocks.length < 2 && candidateBlocks.length > allBlocks.length - 1) {
    // -1 for theme block
    // Add one more if we were too strict
    const used = new Set(allBlocks);
    for (const block of candidateBlocks) {
      if (!used.has(block)) {
        allBlocks.push(block);
        break;
      }
    }
  }

  return { blocks: allBlocks, strength };
}

/**
 * Generate career prediction text from evaluated blocks.
 */
export function generateCareerPrediction(result: RuleEvaluationResult): string {
  if (result.blocks.length === 0) {
    return "Career continues on a steady path. Focus on consistent effort and skill development.";
  }

  // Join blocks with appropriate transitions
  return result.blocks.join(" ");
}
