import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { products } from "./schema";
import { eq } from "drizzle-orm";
import "dotenv/config";

const checkImages = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  console.log("Checking service images...");

  const services = await db
    .select({
      title: products.title,
      slug: products.slug,
      images: products.images,
    })
    .from(products)
    .where(eq(products.productType, "service"));

  console.table(services);
};

checkImages();
