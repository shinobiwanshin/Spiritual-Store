import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { paymentProtection } from "@/lib/arcjet";
import {
  createCashfreeOrder,
  getAppBaseUrl,
  isCashfreeConfigured,
  normalizeCustomerPhone,
} from "@/lib/cashfree";

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
        { error: "Please sign in to checkout" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const amount = body.amount as unknown;
    const currency = (body.currency as string) || "INR";
    const customerPhone = body.customerPhone as string;
    const returnPath = (body.returnPath as string) || "/checkout";

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number." },
        { status: 400 },
      );
    }

    const phone = normalizeCustomerPhone(customerPhone || "");
    if (!phone) {
      return NextResponse.json(
        { error: "Valid 10-digit phone number is required." },
        { status: 400 },
      );
    }

    const user = await currentUser();
    const name =
      user?.fullName ||
      user?.firstName ||
      user?.username ||
      "Customer";
    const email = user?.emailAddresses?.[0]?.emailAddress || "";

    const orderId = `prd_${userId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 20)}_${Date.now()}`.slice(
      0,
      50,
    );

    const base = getAppBaseUrl();
    const returnUrl = `${base}${returnPath.startsWith("/") ? returnPath : `/${returnPath}`}${returnPath.includes("?") ? "&" : "?"}cf=1&order_id={order_id}`;

    if (!isCashfreeConfigured()) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "Cashfree not configured. Returning mock session for development.",
        );
        return NextResponse.json({
          paymentSessionId: "mock_payment_session",
          orderId: `mock_cf_${orderId}`,
          orderAmount: Math.round(amount * 100) / 100,
          currency,
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
      orderAmount: Math.round(amount * 100) / 100,
      orderCurrency: currency,
      customerId: userId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      returnUrl,
      orderNote: "product_checkout",
    });

    return NextResponse.json({
      paymentSessionId: order.payment_session_id,
      orderId: order.order_id,
      orderAmount: order.order_amount,
      currency: order.order_currency,
    });
  } catch (error) {
    console.error("Cashfree create order error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 },
    );
  }
}
