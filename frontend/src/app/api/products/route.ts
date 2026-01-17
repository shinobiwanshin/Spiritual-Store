import { NextRequest, NextResponse } from "next/server";
import { db, products, categories } from "@/db";
import { eq, ilike, or, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "12");
    const page = parseInt(searchParams.get("page") || "1");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const offset = (page - 1) * limit;

    const exclude = searchParams.get("exclude");
    const zodiac = searchParams.get("zodiac");

    const conditions = [];

    if (category && category !== "All") {
      conditions.push(eq(categories.name, category));
    }

    if (exclude) {
      conditions.push(sql`${products.id} != ${exclude}`);
    }

    if (zodiac) {
      // Create Postgres array literal string '{A,B,C}'
      const zodiacs = zodiac
        .split(",")
        .map((z) => z.trim())
        .join(",");
      const arrayLiteral = `{${zodiacs}}`;
      conditions.push(
        sql`${products.zodiacCompatibility} && ${arrayLiteral}::text[]`,
      );
    }

    if (search) {
      conditions.push(
        or(
          ilike(products.title, `%${search}%`),
          ilike(products.description, `%${search}%`),
        ),
      );
    }

    if (minPrice) {
      conditions.push(sql`${products.price} >= ${minPrice}`);
    }

    if (maxPrice) {
      conditions.push(sql`${products.price} <= ${maxPrice}`);
    }

    // 1. Get total count for pagination
    let countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));

    if (conditions.length > 0) {
      // @ts-ignore
      countQuery = countQuery.where(and(...conditions));
    }

    const [totalResult] = await countQuery;
    const total = Number(totalResult?.count || 0);

    // 2. Get paginated results
    let query = db
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
        isLabCertified: products.isLabCertified,
        stock: products.stock,
        benefits: products.benefits,
        howToWear: products.howToWear,
        zodiacCompatibility: products.zodiacCompatibility,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));

    // Apply conditions
    let finalQuery = query;
    if (conditions.length > 0) {
      // @ts-ignore
      finalQuery = query.where(and(...conditions));
    }

    // Apply pagination
    // @ts-ignore
    finalQuery = finalQuery.limit(limit).offset(offset);

    const results = await finalQuery;

    return NextResponse.json({
      products: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
