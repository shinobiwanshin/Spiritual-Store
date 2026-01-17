import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { wishlistItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";

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

    // Note: The file path is [...] so params will carry the dynamic segment.
    // Ideally the file should be named appropriately.
    // If I name the directory [productId], then params.productId works.

    // Logic: Delete where userId AND productId match.
    // This allows deleting by product ID without knowing the wishlist item ID, which is convenient.

    await db
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.userId, userId),
          eq(wishlistItems.productId, productId),
        ),
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wishlist DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
