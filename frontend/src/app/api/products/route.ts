import { NextRequest, NextResponse } from "next/server";
import { db, products, categories } from "@/db";
import { eq, ilike, or, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Safe parse integers with limits
    const MAX_LIMIT = 100;
    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page");
    const limit = limitParam
      ? Math.max(1, Math.min(parseInt(limitParam) || 12, MAX_LIMIT))
      : 12;
    const page = pageParam ? Math.max(1, parseInt(pageParam) || 1) : 1;

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;

    const offset = (page - 1) * limit;

    const exclude = searchParams.get("exclude");
    const zodiac = searchParams.get("zodiac");
    const productType = searchParams.get("type"); // 'product' or 'service'

    const conditions = [];

    if (category && category !== "All") {
      conditions.push(eq(categories.name, category));
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (exclude && uuidRegex.test(exclude)) {
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

    // Filter by product type (product/service)
    if (
      productType &&
      (productType === "product" || productType === "service")
    ) {
      conditions.push(eq(products.productType, productType));
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
        productType: products.productType,
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
