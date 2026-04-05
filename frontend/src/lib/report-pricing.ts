/** Report product slugs and INR prices (configurable for production). */

export const REPORT_METADATA = {
  "1-year-prediction": { type: "1-year", duration: 1, price: 499 },
  "3-year-prediction": { type: "3-year", duration: 3, price: 1299 },
  "5-year-prediction": { type: "5-year", duration: 5, price: 1999 },
} as const;

export const REPORT_SLUGS = Object.keys(REPORT_METADATA) as readonly (keyof typeof REPORT_METADATA)[];

export type ReportSlug = keyof typeof REPORT_METADATA;

export function isReportSlug(s: string): s is ReportSlug {
  return s in REPORT_METADATA;
}

export function slugToReportType(
  slug: ReportSlug,
): "1-year" | "3-year" | "5-year" {
  return REPORT_METADATA[slug]?.type ?? "1-year";
}

export function durationToReportType(
  duration: 1 | 3 | 5,
): "1-year" | "3-year" | "5-year" {
  if (duration === 1) return "1-year";
  if (duration === 3) return "3-year";
  return "5-year";
}

export function priceForSlug(slug: ReportSlug): number {
  return REPORT_METADATA[slug]?.price ?? 499;
}
