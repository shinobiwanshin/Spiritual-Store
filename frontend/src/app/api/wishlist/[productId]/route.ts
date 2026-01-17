import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { wishlistItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * DELETE /api/wishlist/[productId]
 * Removes a specific product from the user's wishlist.
 * Uses userId + productId to identify the entry (no need for wishlist item ID).
 */
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

    const result = await db
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.userId, userId),
          eq(wishlistItems.productId, productId),
        ),
      )
      .returning({ id: wishlistItems.id });

    return NextResponse.json({
      success: true,
      deleted: result.length > 0,
    });
  } catch (error) {
    console.error("Wishlist DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
