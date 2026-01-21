/**
 * Razorpay Webhook Handler
 *
 * This route receives payment event notifications from Razorpay's servers.
 * It is protected by:
 * 1. Razorpay signature verification (primary security)
 * 2. Arcjet rate limiting (secondary protection against abuse)
 *
 * IMPORTANT: Webhooks are server-to-server calls, so no user auth is used.
 *
 * @see https://razorpay.com/docs/webhooks/
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { webhookProtection, isRazorpayIP } from "@/lib/arcjet";
import { db, orders, payments } from "@/db";
import { eq } from "drizzle-orm";

// =============================================================================
// WEBHOOK SIGNATURE VERIFICATION
// =============================================================================

/**
 * Verify Razorpay webhook signature
 *
 * Razorpay signs each webhook payload with your webhook secret.
 * This is the PRIMARY security check - never process a webhook without this.
 *
 * @param payload - Raw request body (NOT parsed JSON)
 * @param signature - Value of x-razorpay-signature header
 * @param secret - Your Razorpay webhook secret (from Dashboard)
 */
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

// =============================================================================
// WEBHOOK HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // =========================================================================
    // ARCJET RATE LIMITING (Secondary Protection)
    // Prevents webhook endpoint abuse while allowing legitimate traffic
    // =========================================================================
    const decision = await webhookProtection.protect(request);

    if (decision.isDenied()) {
      const clientIP =
        request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

      console.warn("Arcjet blocked webhook request:", {
        reason: decision.reason,
        ip: clientIP,
        isKnownRazorpayIP: isRazorpayIP(clientIP),
      });

      // For rate limiting, return 429
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { error: "Too many webhook calls. Please slow down." },
          { status: 429 },
        );
      }

      // For other blocks, still return 403 but log for investigation
      return NextResponse.json(
        { error: "Webhook blocked for security reasons." },
        { status: 403 },
      );
    }

    // =========================================================================
    // SIGNATURE VERIFICATION (Primary Security)
    // This is the critical check - never skip this
    // =========================================================================
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature) {
      console.warn("Webhook received without signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 },
      );
    }

    // Get raw body for signature verification
    const rawBody = await request.text();

    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.warn("Webhook signature verification failed", {
        ip: request.headers.get("x-forwarded-for"),
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // =========================================================================
    // PROCESS WEBHOOK EVENT
    // =========================================================================
    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload;

    console.log("Razorpay webhook received:", eventType);

    switch (eventType) {
      case "payment.authorized":
        // Payment authorized but not yet captured
        // You might want to auto-capture or wait for manual capture
        console.log("Payment authorized:", payload.payment?.entity?.id);
        break;

      case "payment.captured":
        // Payment successfully captured - update order status
        const paymentId = payload.payment?.entity?.id;
        const orderId = payload.payment?.entity?.order_id;

        if (paymentId && orderId) {
          // Update payment status in database
          await db
            .update(payments)
            .set({ status: "captured" })
            .where(eq(payments.razorpayPaymentId, paymentId));

          console.log("Payment captured:", paymentId);
        }
        break;

      case "payment.failed":
        // Payment failed - update order status
        const failedPaymentId = payload.payment?.entity?.id;
        const failedOrderId = payload.payment?.entity?.order_id;

        if (failedOrderId) {
          await db
            .update(orders)
            .set({ status: "cancelled" })
            .where(eq(orders.razorpayOrderId, failedOrderId));

          console.log("Payment failed:", failedPaymentId);
        }
        break;

      case "refund.created":
        // Refund initiated
        console.log("Refund created:", payload.refund?.entity?.id);
        break;

      case "refund.processed":
        // Refund completed - update order status
        const refundPaymentId = payload.refund?.entity?.payment_id;

        if (refundPaymentId) {
          await db
            .update(payments)
            .set({ status: "refunded" })
            .where(eq(payments.razorpayPaymentId, refundPaymentId));

          console.log("Refund processed:", payload.refund?.entity?.id);
        }
        break;

      default:
        // Log unknown events for monitoring
        console.log("Unhandled webhook event:", eventType);
    }

    // Always return 200 to acknowledge receipt
    // Razorpay will retry if it doesn't get a 2xx response
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);

    // Return 500 to trigger Razorpay retry
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
