import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { db, orders, reportEntitlements, payments } from "@/db";
import { paymentProtection } from "@/lib/arcjet";
import {
  verifyCashfreePayment,
} from "@/lib/cashfree";
import {
  isReportSlug,
  priceForSlug,
  slugToReportType,
  type ReportSlug,
} from "@/lib/report-pricing";

export async function POST(request: NextRequest) {
  try {
    const decision = await paymentProtection.protect(request, { requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { error: "Too many payment attempts. Please wait and try again." },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: "Request blocked for security reasons." },
        { status: 403 },
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { cashfree_order_id, slug } = await request.json();

    if (
      !cashfree_order_id ||
      typeof cashfree_order_id !== "string" ||
      !slug ||
      !isReportSlug(slug)
    ) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 },
      );
    }

    const expected = priceForSlug(slug as ReportSlug);
    const reportType = slugToReportType(slug as ReportSlug);

    const existingEntitlement = await db.query.reportEntitlements.findFirst({
      where: and(
        eq(reportEntitlements.userId, userId),
        eq(reportEntitlements.reportType, reportType),
      ),
    });
    if (existingEntitlement) {
      return NextResponse.json({
        success: true,
        alreadyEntitled: true,
        reportType,
      });
    }

    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.cashfreeOrderId, cashfree_order_id),
    });
    if (existingOrder) {
      if (existingOrder.userId !== userId) {
        return NextResponse.json(
          { error: "Order does not belong to this account" },
          { status: 403 },
        );
      }
      const ent = await db.query.reportEntitlements.findFirst({
        where: eq(reportEntitlements.orderId, existingOrder.id),
      });
      if (ent) {
        return NextResponse.json({
          success: true,
          alreadyProcessed: true,
          reportType: ent.reportType,
        });
      }
      return NextResponse.json(
        { error: "This payment was already used" },
        { status: 409 },
      );
    }

    let paymentResult;
    try {
      paymentResult = await verifyCashfreePayment(cashfree_order_id, expected, userId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment verification failed";
      const status = msg.includes("account") ? 403 : 400;
      return NextResponse.json({ error: msg }, { status });
    }
    const { cfPaymentId } = paymentResult;

    const itemsSnapshot = [
      {
        productId: `report-${slug}`,
        title: `Astrology report (${reportType})`,
        price: expected,
        quantity: 1,
        image: "/images/reports/comprehensive-report.jpg",
      },
    ];

    const orderId = await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          userId,
          cashfreeOrderId: cashfree_order_id,
          cashfreePaymentId: cfPaymentId || undefined,
          orderKind: "report",
          status: "paid",
          subtotal: expected.toString(),
          total: expected.toString(),
          shippingAddress: {
            name: "Digital delivery",
            line1: "N/A",
            city: "N/A",
            state: "N/A",
            pincode: "000000",
            phone: "0000000000",
          },
          itemsSnapshot,
          notes: `report:${slug}`,
        })
        .returning();

      await tx.insert(reportEntitlements).values({
        userId,
        reportType,
        orderId: order.id,
      });

      await tx.insert(payments).values({
        orderId: order.id,
        cashfreePaymentId: cfPaymentId || cashfree_order_id,
        cashfreeOrderId: cashfree_order_id,
        amount: expected.toString(),
        status: "captured",
        method: "cashfree",
      });

      return order.id;
    });

    return NextResponse.json({
      success: true,
      reportType,
      orderId,
    });
  } catch (error) {
    console.error("Cashfree verify report error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
