import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { wishlistItems, products, categories } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";

// Validation schema
const addItemSchema = z.object({
  productId: z.string().uuid(),
});

// Pagination defaults
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse pagination params
    const { searchParams } = new URL(req.url);
    const limitParam = parseInt(
      searchParams.get("limit") || String(DEFAULT_LIMIT),
      10,
    );
    const offsetParam = parseInt(searchParams.get("offset") || "0", 10);

    const limit = Math.min(Math.max(1, limitParam || DEFAULT_LIMIT), MAX_LIMIT);
    const offset = Math.max(0, offsetParam || 0);

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
      .orderBy(desc(wishlistItems.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination metadata
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(wishlistItems)
      .where(eq(wishlistItems.userId, userId));

    const total = countResult[0]?.count || 0;

    return NextResponse.json({
      items: userWishlist,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + userWishlist.length < total,
      },
    });
  } catch (error) {
    console.error("Wishlist GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST - Add item to wishlist (atomic insert with conflict handling)
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
        { error: "Invalid product ID", details: validation.error.flatten() },
        { status: 400 },
      );
    }

    const { productId } = validation.data;

    // Verify product exists
    const productExists = await db.query.products.findFirst({
      where: eq(products.id, productId),
      columns: { id: true },
    });

    if (!productExists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Atomic insert with conflict handling (ignore duplicates)
    const result = await db
      .insert(wishlistItems)
      .values({
        userId,
        productId,
      })
      .onConflictDoNothing({
        target: [wishlistItems.userId, wishlistItems.productId],
      })
      .returning({ id: wishlistItems.id });

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Item already in wishlist" },
        { status: 200 },
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Wishlist POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
