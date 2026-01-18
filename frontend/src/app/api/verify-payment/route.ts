import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db, orders, orderItems, cartItems, payments } from "@/db";
import { eq } from "drizzle-orm";

// Type guard for validating item structure
interface OrderItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

function isValidItem(item: unknown): item is OrderItem {
  if (!item || typeof item !== "object") return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.product_id === "string" &&
    obj.product_id.length > 0 &&
    typeof obj.title === "string" &&
    obj.title.length > 0 &&
    typeof obj.price === "number" &&
    Number.isFinite(obj.price) &&
    obj.price >= 0 &&
    typeof obj.quantity === "number" &&
    Number.isInteger(obj.quantity) &&
    obj.quantity > 0 &&
    typeof obj.image === "string"
  );
}

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      items,
      subtotal,
      total,
      shipping_address,
    } = await request.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !user_id ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !items.every(isValidItem) ||
      typeof subtotal !== "number" ||
      !Number.isFinite(subtotal) ||
      subtotal < 0 ||
      typeof total !== "number" ||
      !Number.isFinite(total) ||
      total < 0 ||
      !shipping_address
    ) {
      return NextResponse.json(
        { error: "Invalid or missing required payment details" },
        { status: 400 },
      );
    }

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    // Payment verified - create order with items in a transaction-like flow
    // Transform items to match OrderItemSnapshot format
    const itemsSnapshot = items.map((item: OrderItem) => ({
      productId: item.product_id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const [order] = await db
      .insert(orders)
      .values({
        userId: user_id,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: "paid",
        subtotal: subtotal.toString(),
        total: total.toString(),
        shippingAddress: shipping_address,
        itemsSnapshot: itemsSnapshot, // JSON snapshot for display
      })
      .returning();

    // Create order items for analytics/queries
    const orderItemsData = items.map(
      (item: {
        product_id: string;
        title: string;
        price: number;
        quantity: number;
        image: string;
      }) => ({
        orderId: order.id,
        productId: item.product_id,
        title: item.title,
        price: item.price.toString(),
        quantity: item.quantity,
        image: item.image,
      }),
    );

    await db.insert(orderItems).values(orderItemsData);

    // Create payment record for audit
    await db.insert(payments).values({
      orderId: order.id,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      amount: total.toString(),
      status: "captured",
    });

    // Clear user's cart
    await db.delete(cartItems).where(eq(cartItems.userId, user_id));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Payment verified and order created",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
