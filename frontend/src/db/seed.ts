import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { products as productsData } from "@/data/products";
import { products, categories, type NewProduct } from "./schema";
import "dotenv/config";

const runSeed = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  console.log("⏳ Connecting to Neon database...");

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("🚀 Seeding database...");

  try {
    // 1. Create categories first
    console.log("Inserting categories...");
    const uniqueCategories = Array.from(
      new Set(productsData.map((p) => p.category)),
    );

    // Create map to store category IDs
    const categoryMap = new Map<string, string>();

    for (const categoryName of uniqueCategories) {
      const slug = categoryName.toLowerCase().replace(/ /g, "-");

      await db
        .insert(categories)
        .values({
          name: categoryName,
          slug: slug,
          description: `All ${categoryName} products`,
        })
        .onConflictDoNothing();
    }

    // Fetch all categories to populate map
    const allCategories = await db.select().from(categories);
    allCategories.forEach((c) => categoryMap.set(c.name, c.id));

    // 2. Insert Products
    console.log("Inserting products...");

    for (const p of productsData) {
      const categoryId = categoryMap.get(p.category);

      // Remove currency symbol and commas for price
      const price = parseFloat(p.price.replace(/[^0-9.]/g, ""));
      const originalPrice = p.originalPrice
        ? parseFloat(p.originalPrice.replace(/[^0-9.]/g, ""))
        : null;

      const productValues: NewProduct = {
        title: p.title,
        slug: p.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
        description: p.description,
        price: price.toString(),
        originalPrice: originalPrice ? originalPrice.toString() : null,
        discount: p.discount,
        images: p.images,
        categoryId: categoryId,
        isLabCertified: p.isLabCertified,
        rating: p.rating.toString(),
        reviewsCount: p.reviews,
        benefits: p.benefits,
        howToWear: p.howToWear,
        zodiacCompatibility: p.zodiacCompatibility,
        stock: 50, // Default stock
      };

      await db.insert(products).values(productValues).onConflictDoUpdate({
        target: products.slug,
        set: productValues,
      });
    }

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

runSeed().catch((err) => {
  console.error("❌ Unhandled seed error:", err);
  process.exit(1);
});
