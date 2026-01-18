import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";

// Lazy initialization to avoid build-time errors when env vars are not set
let razorpay: Razorpay | null = null;

function getRazorpay(): Razorpay | null {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication to create checkout orders
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to checkout" },
        { status: 401 },
      );
    }

    const { amount, currency = "INR", receipt, notes } = await request.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number." },
        { status: 400 },
      );
    }

    const razorpayInstance = getRazorpay();

    // If Razorpay is not configured
    if (!razorpayInstance) {
      // Only return mock response in development
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "Razorpay not configured. Returning mock order for development.",
        );
        return NextResponse.json({
          orderId: `mock_order_${Date.now()}`,
          amount: Math.round(amount * 100),
          currency,
          mock: true,
          message: "Payment gateway not configured. This is a demo order.",
        });
      }
      // In production, return error
      console.error("Razorpay not configured in production environment");
      return NextResponse.json(
        { error: "Payment gateway is not configured. Please contact support." },
        { status: 500 },
      );
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: receipt || `order_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpayInstance.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
