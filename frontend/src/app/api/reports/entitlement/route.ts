import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { db, astrologyReports, reportEntitlements } from "@/db";
import {
  isReportSlug,
  slugToReportType,
  type ReportSlug,
} from "@/lib/report-pricing";

export const dynamic = "force-dynamic";

/**
 * GET /api/reports/entitlement?slug=1-year-prediction
 * Returns whether the user may generate this report (paid entitlement or already saved report).
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug || !isReportSlug(slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const reportType = slugToReportType(slug as ReportSlug);

    const entitlement = await db.query.reportEntitlements.findFirst({
      where: and(
        eq(reportEntitlements.userId, userId),
        eq(reportEntitlements.reportType, reportType),
      ),
    });

    const existingReport = await db.query.astrologyReports.findFirst({
      where: and(
        eq(astrologyReports.userId, userId),
        eq(astrologyReports.reportType, reportType),
      ),
    });

    return NextResponse.json({
      entitled: Boolean(entitlement),
      hasSavedReport: Boolean(existingReport),
      reportType,
    });
  } catch (error) {
    console.error("Entitlement check error:", error);
    return NextResponse.json(
      { error: "Failed to check entitlement" },
      { status: 500 },
    );
  }
}
