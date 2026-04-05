import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { paymentProtection } from "@/lib/arcjet";
import {
  createCashfreeOrder,
  getAppBaseUrl,
  isCashfreeConfigured,
  normalizeCustomerPhone,
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
          { error: "Too many requests. Please try again later." },
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
        { error: "Please sign in to purchase a report" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const slug = body.slug as string;
    const customerPhone = body.customerPhone as string;

    if (!slug || !isReportSlug(slug)) {
      return NextResponse.json({ error: "Invalid report" }, { status: 400 });
    }

    const phone = normalizeCustomerPhone(customerPhone || "");
    if (!phone) {
      return NextResponse.json(
        { error: "Valid 10-digit phone number is required." },
        { status: 400 },
      );
    }

    const amount = priceForSlug(slug as ReportSlug);
    const user = await currentUser();
    const name =
      user?.fullName ||
      user?.firstName ||
      user?.username ||
      "Customer";
    const email = user?.emailAddresses?.[0]?.emailAddress || "";

    const shortUid = userId.replace(/[^a-zA-Z0-9]/g, "").slice(-12);
    const timestamp = Date.now().toString();
    const prefix = `rpt_`;
    const suffix = `_${shortUid}_${timestamp}`;
    const maxSlugLen = 50 - prefix.length - suffix.length;
    const truncatedSlug = slug.replace(/-/g, "").slice(0, Math.max(0, maxSlugLen));
    const orderId = `${prefix}${truncatedSlug}${suffix}`.slice(0, 50);

    const base = getAppBaseUrl();
    const returnUrl = `${base}/reports/${slug}?cf=1&order_id={order_id}`;

    if (!isCashfreeConfigured()) {
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({
          paymentSessionId: "mock_payment_session",
          orderId: `mock_cf_${orderId}`,
          orderAmount: amount,
          currency: "INR",
          reportType: slugToReportType(slug as ReportSlug),
          mock: true,
        });
      }
      return NextResponse.json(
        { error: "Payment gateway is not configured." },
        { status: 500 },
      );
    }

    const order = await createCashfreeOrder({
      orderId,
      orderAmount: amount,
      orderCurrency: "INR",
      customerId: userId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      returnUrl,
      orderNote: `report:${slug}`,
    });

    return NextResponse.json({
      paymentSessionId: order.payment_session_id,
      orderId: order.order_id,
      orderAmount: order.order_amount,
      currency: order.order_currency,
      reportType: slugToReportType(slug as ReportSlug),
    });
  } catch (error) {
    console.error("Cashfree create report order error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 },
    );
  }
}
