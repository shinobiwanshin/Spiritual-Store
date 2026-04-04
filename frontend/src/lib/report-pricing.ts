/** Report product slugs and INR prices (configurable for production). */

export const REPORT_SLUGS = [
  "1-year-prediction",
  "3-year-prediction",
  "5-year-prediction",
] as const;

export type ReportSlug = (typeof REPORT_SLUGS)[number];

export function isReportSlug(s: string): s is ReportSlug {
  return (REPORT_SLUGS as readonly string[]).includes(s);
}

export function slugToReportType(
  slug: ReportSlug,
): "1-year" | "3-year" | "5-year" {
  switch (slug) {
    case "1-year-prediction":
      return "1-year";
    case "3-year-prediction":
      return "3-year";
    case "5-year-prediction":
      return "5-year";
    default:
      return "1-year";
  }
}

export function durationToReportType(
  duration: 1 | 3 | 5,
): "1-year" | "3-year" | "5-year" {
  if (duration === 1) return "1-year";
  if (duration === 3) return "3-year";
  return "5-year";
}

/** INR amounts for one-time report purchase */
export const REPORT_PRICE_INR: Record<1 | 3 | 5, number> = {
  1: 499,
  3: 1299,
  5: 1999,
};

export function priceForSlug(slug: ReportSlug): number {
  const d = slug === "1-year-prediction" ? 1 : slug === "3-year-prediction" ? 3 : 5;
  return REPORT_PRICE_INR[d];
}
