import { NextRequest, NextResponse } from "next/server";
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
    const { amount, currency = "INR", receipt, notes } = await request.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number." },
        { status: 400 },
      );
    }

    const razorpayInstance = getRazorpay();

    // If Razorpay is not configured, return a mock response for development/demo
    if (!razorpayInstance) {
      console.warn("Razorpay not configured. Returning mock order.");
      return NextResponse.json({
        orderId: `mock_order_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency,
        mock: true,
        message: "Payment gateway not configured. This is a demo order.",
      });
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
