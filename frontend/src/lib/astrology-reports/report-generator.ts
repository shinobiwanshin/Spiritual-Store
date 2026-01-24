/**
 * Report Generator
 *
 * Orchestrates multi-year report generation with phase grouping
 * for 5-year reports. This is the main entry point for report generation.
 */

import {
  AstrologyProfile,
  AstrologyReport,
  ReportDuration,
  ReportPhase,
  YearlyReport,
  DISCLAIMER,
} from "./types";
import { buildYearlyReport } from "./year-builder";

/**
 * Duration labels for display
 */
const DURATION_LABELS: Record<ReportDuration, string> = {
  1: "1 Year",
  3: "3 Years",
  5: "5 Years",
};

/**
 * Generate phase groupings for 5-year reports.
 * Divides years into Setup, Growth, and Consolidation phases.
 */
function generatePhases(reports: YearlyReport[]): ReportPhase[] {
  if (reports.length < 5) return [];

  const phases: ReportPhase[] = [
    {
      name: "Setup Phase",
      years: [reports[0].year, reports[1].year],
      summary:
        `The first two years (${reports[0].year}-${reports[1].year}) focus on ` +
        "establishing foundations and preparing for growth. Key themes include " +
        `${reports[0].theme} and ${reports[1].theme} energy patterns.`,
    },
    {
      name: "Growth Phase",
      years: [reports[2].year, reports[3].year],
      summary:
        `Years ${reports[2].year}-${reports[3].year} bring expansion and ` +
        "development. This is the period where earlier groundwork begins to show results.",
    },
    {
      name: "Consolidation Phase",
      years: [reports[4].year],
      summary:
        `${reports[4].year} marks the culmination of this 5-year cycle. ` +
        "Focus on solidifying gains and preparing for the next major cycle.",
    },
  ];

  return phases;
}

/**
 * Adjust report depth based on duration.
 * 5-year reports are slightly more condensed per year.
 */
function adjustReportDepth(
  reports: YearlyReport[],
  duration: ReportDuration,
): YearlyReport[] {
  // For 1-year reports, content is most detailed (no changes needed)
  // For 3-year reports, moderate detail
  // For 5-year reports, summarized view per year

  // Currently returning as-is; can add truncation logic if needed
  return reports;
}

/**
 * Generate a complete astrology report.
 * This is the main public API for report generation.
 *
 * @param profile - Normalized astrology profile
 * @param duration - Report duration (1, 3, or 5 years)
 * @returns Complete structured report
 */
import { calculateCoreNumerology } from "./numerology";
import { getSunSign, getZodiacRelations } from "./zodiac";
export function generateReport(
  profile: AstrologyProfile,
  duration: ReportDuration,
): AstrologyReport {
  // Calculate years to cover
  const startYear = profile.year;
  const years = Array.from({ length: duration }, (_, i) => startYear + i);

  // Build individual yearly reports
  const rawReports = years.map((year) => buildYearlyReport(profile, year));

  // Adjust depth based on duration
  const reports = adjustReportDepth(rawReports, duration);

  // Generate phases for 5-year reports
  const phases = duration === 5 ? generatePhases(reports) : undefined;

  // Calculate Core Numerology if name is provided
  const numerology = profile.name
    ? calculateCoreNumerology(profile.dob, profile.name)
    : undefined;

  // Calculate Zodiac Relations based on DOB
  const sunSign = getSunSign(profile.dob);
  const relations = getZodiacRelations(sunSign);
  const zodiacRelations = {
    friendSigns: relations.friends,
    enemySigns: relations.enemies,
  };

  // Assemble final report
  const report: AstrologyReport = {
    duration: DURATION_LABELS[duration],
    years,
    reports,
    phases,
    generatedAt: new Date().toISOString(),
    disclaimer: DISCLAIMER,
    numerology,
    zodiacRelations,
  };

  return report;
}

/**
 * Generate a cached report key for deterministic caching.
 * Same inputs will always produce the same cache key.
 */
export function generateCacheKey(
  profile: AstrologyProfile,
  duration: ReportDuration,
): string {
  const keyParts = [
    profile.dob,
    profile.sunSign,
    profile.moonSign,
    profile.ascendant,
    profile.currentDasha,
    profile.year.toString(),
    duration.toString(),
    // Add planetary positions for uniqueness
    JSON.stringify(profile.planetaryHouses),
    JSON.stringify(profile.planetarySigns),
  ];

  // Simple hash function for cache key
  const hashString = keyParts.join("|");
  let hash = 0;
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return `report_${Math.abs(hash).toString(36)}`;
}

/**
 * Validate that a profile has all required fields.
 */
export function validateProfile(profile: Partial<AstrologyProfile>): string[] {
  const errors: string[] = [];

  if (!profile.dob) errors.push("Date of birth is required");
  if (!profile.sunSign) errors.push("Sun sign is required");
  if (!profile.moonSign) errors.push("Moon sign is required");
  if (!profile.ascendant) errors.push("Ascendant is required");
  if (!profile.currentDasha) errors.push("Current dasha is required");
  if (!profile.year) errors.push("Base year is required");
  if (!profile.planetaryHouses) errors.push("Planetary houses are required");
  if (!profile.planetarySigns) errors.push("Planetary signs are required");

  return errors;
}
