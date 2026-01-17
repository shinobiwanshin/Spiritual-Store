import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// DELETE - Remove specific item from cart
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 },
      );
    }

    await db
      .delete(cartItems)
      .where(
        and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)),
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart Item DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
