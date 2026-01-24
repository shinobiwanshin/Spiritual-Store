/**
 * Report Generation API Endpoint
 *
 * POST /api/reports/generate
 *
 * Generates deterministic astrology reports based on birth chart data.
 * Checks database for cached reports first to avoid regeneration.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { astrologyReports } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  generateReport,
  createProfile,
  validateProfile,
  generateCacheKey,
  ReportDuration,
  AstrologyReport,
} from "@/lib/astrology-reports";

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

    // Generate cache key for deterministic lookup
    const cacheKey = generateCacheKey(profile, body.duration);

    // Check if report already exists in database
    const existingReport = await db.query.astrologyReports.findFirst({
      where: eq(astrologyReports.cacheKey, cacheKey),
    });

    if (existingReport) {
      // Return cached report
      return NextResponse.json({
        success: true,
        fromCache: true,
        reportId: existingReport.id,
        report: existingReport.reportData as AstrologyReport,
      });
    }

    // Generate the report (deterministic)
    const report = generateReport(profile, body.duration);

    // Store in database
    const reportType = `${body.duration}-year` as
      | "1-year"
      | "3-year"
      | "5-year";

    const [savedReport] = await db
      .insert(astrologyReports)
      .values({
        userId,
        orderId: body.orderId,
        reportType,
        birthData: {
          dob: profile.dob,
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

    return NextResponse.json({
      success: true,
      fromCache: false,
      reportId: savedReport.id,
      report,
    });
  } catch (error) {
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
