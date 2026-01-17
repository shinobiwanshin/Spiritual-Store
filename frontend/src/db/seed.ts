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

      const [insertedCategory] = await db
        .insert(categories)
        .values({
          name: categoryName,
          slug: slug,
          description: `All ${categoryName} products`,
        })
        .onConflictDoUpdate({
          target: categories.name,
          set: { name: categoryName }, // No-op update to get the ID if exists
        })
        .returning();

      // If onConflictDoUpdate doesn't return (if nothing changed), we need to fetch it
      if (insertedCategory) {
        categoryMap.set(categoryName, insertedCategory.id);
      } else {
        const [existingCategory] = await db
          .select()
          .from(categories)
          .where(categories.name, categoryName); // This syntax might be wrong for drizzle, fixing below
        // Actually for simplicity, let's just delete all and insert fresh or handle simpler
      }
    }

    // Correct approach for categories:
    // It's safer to just fetch all categories after insertion to build the map
    // But since we are seeding, maybe just clear tables first?
    // Let's try a safer upsert approach.

    // Let's actually fetch the categories after attempting insert to be sure
    const dbCategories = await db.select().from(categories);
    // If empty, re-insert.

    if (dbCategories.length === 0) {
      for (const categoryName of uniqueCategories) {
        const slug = categoryName.toLowerCase().replace(/ /g, "-");
        await db.insert(categories).values({
          name: categoryName,
          slug: slug,
          description: `All ${categoryName} products`,
        });
      }
    }

    // Refresh category map
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

      await db.insert(products).values(productValues).onConflictDoNothing();
    }

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

runSeed();
