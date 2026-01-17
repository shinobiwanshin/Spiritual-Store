import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { wishlistItems, products, categories } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";

// Validations
const addItemSchema = z.object({
  productId: z.string().uuid(),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch wishlist items with product details and category name
    const userWishlist = await db
      .select({
        id: wishlistItems.id,
        addedAt: wishlistItems.createdAt,
        product: products,
        categoryName: categories.name,
      })
      .from(wishlistItems)
      .innerJoin(products, eq(wishlistItems.productId, products.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(wishlistItems.userId, userId))
      .orderBy(desc(wishlistItems.createdAt));

    return NextResponse.json(userWishlist);
  } catch (error) {
    console.error("Wishlist GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = addItemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    const { productId } = validation.data;

    // Check if already exists to prevent duplicates (though DB has unique constraint)
    // We can use onConflictDoNothing or just let it fail/check first.
    // Let's check first to return a specific message or just toggle?
    // The requirement says "Add item (toggle)" in plan, but API is POST.
    // Usually POST is add. DELETE is remove.
    // If frontend handles toggle, it calls POST or DELETE.
    // I will implement strictly ADD here.

    const existing = await db.query.wishlistItems.findFirst({
      where: and(
        eq(wishlistItems.userId, userId),
        eq(wishlistItems.productId, productId),
      ),
    });

    if (existing) {
      return NextResponse.json(
        { message: "Item already in wishlist" },
        { status: 200 }, // Or 409 Conflict
      );
    }

    await db.insert(wishlistItems).values({
      userId,
      productId,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Wishlist POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
