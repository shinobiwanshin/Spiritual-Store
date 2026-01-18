import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { cartItems, products } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
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

// POST - Add item to cart (upsert with conflict handling)
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

    // Verify product exists before inserting
    const productExists = await db.query.products.findFirst({
      where: eq(products.id, productId),
      columns: { id: true },
    });

    if (!productExists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Atomic upsert: insert or increment quantity on conflict
    await db
      .insert(cartItems)
      .values({
        userId,
        productId,
        quantity,
      })
      .onConflictDoUpdate({
        target: [cartItems.userId, cartItems.productId],
        set: {
          quantity: sql`${cartItems.quantity} + ${quantity}`,
        },
      });

    return NextResponse.json({ success: true }, { status: 201 });
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
        { error: "Invalid request body", details: validation.error.flatten() },
        { status: 400 },
      );
    }

    const { productId, quantity } = validation.data;

    const result = await db
      .update(cartItems)
      .set({ quantity })
      .where(
        and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)),
      )
      .returning({ id: cartItems.id });

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 },
      );
    }

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
