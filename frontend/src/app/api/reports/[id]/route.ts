/**
 * Single Report API Endpoint
 *
 * GET /api/reports/[id]
 *
 * Retrieves a specific report by ID.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { astrologyReports } from "@/db/schema";
import { eq, and } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get report by ID, ensuring it belongs to the user
    const report = await db.query.astrologyReports.findFirst({
      where: and(
        eq(astrologyReports.id, id),
        eq(astrologyReports.userId, userId),
      ),
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        reportType: report.reportType,
        birthData: report.birthData,
        reportData: report.reportData,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 },
    );
  }
}
