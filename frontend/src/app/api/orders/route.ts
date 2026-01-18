import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, orders } from "@/db";
import { eq, desc } from "drizzle-orm";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get authenticated user from server-side auth (not client-provided)
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    return NextResponse.json({ orders: userOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
