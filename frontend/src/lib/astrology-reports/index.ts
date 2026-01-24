/**
 * Astrology Report Engine - Public API
 *
 * This file exports all public interfaces for the report engine.
 */

// Core types
export type {
  AstrologyProfile,
  AstrologyReport,
  YearlyReport,
  ReportDuration,
  ReportPhase,
  YearThemeKey,
  YearTheme,
  RuleEvaluationResult,
} from "./types";

export { DISCLAIMER, PLANETS, ZODIAC_SIGNS } from "./types";

// Main generation functions
export {
  generateReport,
  generateCacheKey,
  validateProfile,
} from "./report-generator";

// Normalization utilities
export { normalizeApiResponse, createProfile } from "./normalizer";

// Theme utilities (for UI display)
export { getYearTheme, getYearThemes, YEAR_THEMES } from "./themes";

// Individual year building (for advanced use)
export { buildYearlyReport } from "./year-builder";

// PDF generation
export { generatePrintHTML, printReport } from "./pdf-generator";
export type { ExtendedAstrologyReport } from "./pdf-generator";
