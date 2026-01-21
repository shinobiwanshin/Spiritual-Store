import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { products } from "./schema";
import { eq } from "drizzle-orm";
import "dotenv/config";

const checkImages = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("Checking service images...");

  const services = await db.select({
    title: products.title,
    slug: products.slug,
    images: products.images
  }).from(products)
  .where(eq(products.productType, "service"));

  console.table(services);
};

checkImages();
