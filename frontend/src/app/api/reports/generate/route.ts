/**
 * Report Generation API Endpoint
 *
 * POST /api/reports/generate
 *
 * Generates astrology reports based on birth chart data.
 * Requires a paid entitlement token and consumes it after generation.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, astrologyReports, reportEntitlements } from "@/db";
import * as Sentry from "@sentry/nextjs";
import { and, eq } from "drizzle-orm";
import {
  generateReport,
  createProfile,
  validateProfile,
  generateCacheKey,
  ReportDuration,
} from "@/lib/astrology-reports";

type EntitlementReportType =
  (typeof reportEntitlements.$inferSelect)["reportType"];

const REPORT_TYPE_BY_DURATION: Record<ReportDuration, EntitlementReportType> = {
  1: "1-year",
  3: "3-year",
  5: "5-year",
};

interface GenerateReportRequest {
  /** Date of birth (YYYY-MM-DD) */
  dob: string;

  /** Full Name */
  name?: string;

  /** Sun sign */
  sunSign: string;

  /** Moon sign */
  moonSign: string;

  /** Ascendant/Rising sign */
  ascendant: string;

  /** Map of planet to house number */
  planetaryHouses: Record<string, number>;

  /** Map of planet to zodiac sign */
  planetarySigns: Record<string, string>;

  /** Current Mahadasha */
  currentDasha: string;

  /** Upcoming dashas (optional) */
  upcomingDashas?: string[];

  /** Report duration: 1, 3, or 5 years */
  duration: 1 | 3 | 5;

  /** Base year for report (defaults to current year) */
  year?: number;

  /** Order ID if this is a purchased report */
  orderId?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as GenerateReportRequest;

    // Validate duration
    const validDurations: ReportDuration[] = [1, 3, 5];
    if (!validDurations.includes(body.duration)) {
      return NextResponse.json(
        { error: "Invalid duration. Must be 1, 3, or 5." },
        { status: 400 },
      );
    }

    // Create normalized profile
    const profile = createProfile({
      dob: body.dob,
      name: body.name,
      sunSign: body.sunSign,
      moonSign: body.moonSign,
      ascendant: body.ascendant,
      planetaryHouses: body.planetaryHouses,
      planetarySigns: body.planetarySigns,
      currentDasha: body.currentDasha,
      upcomingDashas: body.upcomingDashas,
      year: body.year || new Date().getFullYear(),
    });

    // Validate profile
    const validationErrors = validateProfile(profile);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Invalid profile data", details: validationErrors },
        { status: 400 },
      );
    }

    const reportType = REPORT_TYPE_BY_DURATION[body.duration];

    // Consume entitlement and persist report atomically to prevent double-spend.
    const transactionResult = await db.transaction(async (tx) => {
      const [entitlement] = await tx
        .delete(reportEntitlements)
        .where(
          and(
            eq(reportEntitlements.userId, userId),
            eq(reportEntitlements.reportType, reportType),
          ),
        )
        .returning({
          id: reportEntitlements.id,
          orderId: reportEntitlements.orderId,
        });

      if (!entitlement) {
        return null;
      }

      // Generate only after entitlement is locked and confirmed.
      const report = generateReport(profile, body.duration);

      // Keep deterministic content but make each paid generation a unique persisted record.
      const cacheKey = `${generateCacheKey(profile, body.duration)}:${entitlement.id}`;

      const [insertedReport] = await tx
        .insert(astrologyReports)
        .values({
          userId,
          orderId: entitlement.orderId,
          reportType,
          birthData: {
            dob: profile.dob,
            name: profile.name,
            sunSign: profile.sunSign,
            moonSign: profile.moonSign,
            ascendant: profile.ascendant,
            planetaryHouses: profile.planetaryHouses,
            planetarySigns: profile.planetarySigns,
            currentDasha: profile.currentDasha,
            upcomingDashas: profile.upcomingDashas,
          },
          reportData: report,
          cacheKey,
        })
        .returning();

      return {
        report: insertedReport.reportData,
        reportId: insertedReport.id,
      };
    });

    if (!transactionResult) {
      return NextResponse.json(
        {
          error:
            "Payment required. Please complete payment before generating this report.",
        },
        { status: 402 },
      );
    }

    return NextResponse.json({
      success: true,
      fromCache: false,
      reportId: transactionResult.reportId,
      report: transactionResult.report,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: "reports-generate" },
      extra: { route: "/api/reports/generate" },
    });
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint to return schema information
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/reports/generate",
    method: "POST",
    description: "Generate 1, 3, or 5 year astrology prediction reports",
    requiredFields: {
      dob: "string (YYYY-MM-DD)",
      sunSign: "string (zodiac sign)",
      moonSign: "string (zodiac sign)",
      ascendant: "string (zodiac sign)",
      planetaryHouses: "object { planet: houseNumber (1-12) }",
      planetarySigns: "object { planet: zodiacSign }",
      currentDasha: "string (planet name)",
      duration: "number (1, 3, or 5)",
    },
    optionalFields: {
      upcomingDashas: "string[] (list of upcoming dasha planets)",
      year: "number (base year for report, defaults to current year)",
      orderId: "string (order ID if this is a purchased report)",
    },
    exampleRequest: {
      dob: "1990-05-15",
      sunSign: "Taurus",
      moonSign: "Cancer",
      ascendant: "Leo",
      planetaryHouses: {
        sun: 10,
        moon: 12,
        mars: 7,
        mercury: 10,
        jupiter: 9,
        venus: 11,
        saturn: 5,
        rahu: 3,
        ketu: 9,
      },
      planetarySigns: {
        sun: "Taurus",
        moon: "Cancer",
        mars: "Scorpio",
        mercury: "Taurus",
        jupiter: "Sagittarius",
        venus: "Gemini",
        saturn: "Capricorn",
        rahu: "Libra",
        ketu: "Aries",
      },
      currentDasha: "Jupiter",
      duration: 3,
    },
  });
}
