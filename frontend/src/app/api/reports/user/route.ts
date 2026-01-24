/**
 * User Reports API Endpoint
 *
 * GET /api/reports/user
 *
 * Retrieves all astrology reports for the authenticated user.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { astrologyReports } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get all reports for this user, newest first
    const reports = await db.query.astrologyReports.findMany({
      where: eq(astrologyReports.userId, userId),
      orderBy: desc(astrologyReports.createdAt),
    });

    return NextResponse.json({
      success: true,
      reports: reports.map((r) => ({
        id: r.id,
        reportType: r.reportType,
        years: r.reportData.years,
        createdAt: r.createdAt,
        // Include summary but not full data for list view
        preview: {
          duration: r.reportData.duration,
          years: r.reportData.years,
          firstYearTheme: r.reportData.reports[0]?.theme,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching user reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 },
    );
  }
}
