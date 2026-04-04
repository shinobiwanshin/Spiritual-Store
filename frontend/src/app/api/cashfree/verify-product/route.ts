import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db, cartItems, orderItems, orders, payments } from "@/db";
import { paymentProtection } from "@/lib/arcjet";
import {
  amountsMatch,
  fetchCashfreeOrder,
  fetchFirstCashfreePaymentId,
  isCashfreeOrderPaid,
} from "@/lib/cashfree";

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

    const {
      cashfree_order_id,
      items,
      total,
      shipping_address,
    } = await request.json();

    if (
      !cashfree_order_id ||
      typeof cashfree_order_id !== "string" ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !items.every(isValidItem) ||
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

    const subtotal = items.reduce(
      (s: number, it: OrderItem) => s + it.price * it.quantity,
      0,
    );
    if (!Number.isFinite(subtotal) || Math.abs(subtotal - total) > 0.05) {
      return NextResponse.json(
        { error: "Order total does not match items" },
        { status: 400 },
      );
    }

    const prior = await db.query.orders.findFirst({
      where: eq(orders.cashfreeOrderId, cashfree_order_id),
    });
    if (prior) {
      if (prior.userId !== userId) {
        return NextResponse.json(
          { error: "Order does not belong to this account" },
          { status: 403 },
        );
      }
      return NextResponse.json({
        success: true,
        orderId: prior.id,
        duplicate: true,
      });
    }

    let cfPaymentId: string | null = null;
    let paidAmount = total;

    if (
      process.env.NODE_ENV !== "production" &&
      cashfree_order_id.startsWith("mock_cf_")
    ) {
      paidAmount = total;
      cfPaymentId = "mock_cf_payment";
    } else {
      const cfOrder = await fetchCashfreeOrder(cashfree_order_id);
      const custId = cfOrder.customer_details as
        | { customer_id?: string }
        | undefined;
      if (custId?.customer_id !== userId) {
        return NextResponse.json(
          { error: "Order does not belong to this account" },
          { status: 403 },
        );
      }
      const amt = cfOrder.order_amount;
      if (typeof amt !== "number" || !amountsMatch(amt, total)) {
        return NextResponse.json(
          { error: "Paid amount does not match order" },
          { status: 400 },
        );
      }
      if (!isCashfreeOrderPaid(cfOrder)) {
        return NextResponse.json(
          { error: "Payment is not completed" },
          { status: 400 },
        );
      }
      cfPaymentId =
        (await fetchFirstCashfreePaymentId(cashfree_order_id)) ??
        cashfree_order_id;
      paidAmount = typeof amt === "number" ? amt : total;
    }

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
        userId,
        cashfreeOrderId: cashfree_order_id,
        cashfreePaymentId: cfPaymentId || undefined,
        orderKind: "product",
        status: "paid",
        subtotal: subtotal.toString(),
        total: paidAmount.toString(),
        shippingAddress: shipping_address,
        itemsSnapshot,
      })
      .returning();

    const orderItemsData = items.map((item: OrderItem) => ({
      orderId: order.id,
      productId: item.product_id,
      title: item.title,
      price: item.price.toString(),
      quantity: item.quantity,
      image: item.image,
    }));

    await db.insert(orderItems).values(orderItemsData);

    await db.insert(payments).values({
      orderId: order.id,
      cashfreePaymentId: cfPaymentId || cashfree_order_id,
      cashfreeOrderId: cashfree_order_id,
      amount: paidAmount.toString(),
      status: "captured",
      method: "cashfree",
    });

    await db.delete(cartItems).where(eq(cartItems.userId, userId));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Payment verified and order created",
    });
  } catch (error) {
    console.error("Cashfree verify product error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
