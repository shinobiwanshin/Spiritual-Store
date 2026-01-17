import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { cartItems, products } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

// Validation schemas
const addItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().optional().default(1),
});

const updateItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

// GET - Fetch user's cart items
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userCart = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        product: products,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId))
      .orderBy(desc(cartItems.createdAt));

    return NextResponse.json(userCart);
  } catch (error) {
    console.error("Cart GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST - Add item to cart (or increment quantity if exists)
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
        { error: "Invalid request body", details: validation.error.flatten() },
        { status: 400 },
      );
    }

    const { productId, quantity } = validation.data;

    // Check if item already in cart
    const existing = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, productId),
      ),
    });

    if (existing) {
      // Update quantity
      await db
        .update(cartItems)
        .set({ quantity: existing.quantity + quantity })
        .where(eq(cartItems.id, existing.id));

      return NextResponse.json({ success: true, action: "updated" });
    }

    // Insert new item
    await db.insert(cartItems).values({
      userId,
      productId,
      quantity,
    });

    return NextResponse.json(
      { success: true, action: "added" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Cart POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PUT - Update item quantity
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = updateItemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { productId, quantity } = validation.data;

    await db
      .update(cartItems)
      .set({ quantity })
      .where(
        and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)),
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart PUT Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// DELETE - Clear entire cart
export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(cartItems).where(eq(cartItems.userId, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
