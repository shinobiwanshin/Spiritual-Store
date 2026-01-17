import { NextRequest, NextResponse } from "next/server";
import { db, products, categories } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 },
      );
    }

    const [product] = await db
      .select({
        id: products.id,
        title: products.title,
        slug: products.slug,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        discount: products.discount,
        images: products.images,
        category: categories.name,
        rating: products.rating,
        reviews: products.reviewsCount,
        benefits: products.benefits,
        howToWear: products.howToWear,
        zodiacCompatibility: products.zodiacCompatibility,
        isLabCertified: products.isLabCertified,
        stock: products.stock,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
