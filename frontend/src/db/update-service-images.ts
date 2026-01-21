import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { products } from "./schema";
import { eq } from "drizzle-orm";
import "dotenv/config";

const updateServiceImages = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("Updating service images...");

  // Update Sampurna Kundali
  await db
    .update(products)
    .set({ images: ["/images/services/sampurna-kundali.jpg"] })
    .where(eq(products.slug, "sampurna-kundali"));

  // Update Education Consultation
  await db
    .update(products)
    .set({ images: ["/images/services/education-consultation.jpg"] })
    .where(eq(products.slug, "education-problems-consultation"));

  // Update Career Consultation
  await db
    .update(products)
    .set({ images: ["/images/services/career-consultation.jpg"] })
    .where(eq(products.slug, "career-problems-consultation"));

  // Update Monthly Kundali
  await db
    .update(products)
    .set({ images: ["/images/services/monthly-kundali.jpg"] })
    .where(eq(products.slug, "monthly-kundali"));

  // Update Family Consultation
  await db
    .update(products)
    .set({ images: ["/images/services/family-consultation.jpg"] })
    .where(eq(products.slug, "family-problems-consultation"));

  // Update Marriage Consultation (Mapped to Marital Problems)
  await db
    .update(products)
    .set({ images: ["/images/services/marriage-consultation.jpg"] })
    .where(eq(products.slug, "marital-problems-consultation"));

  // Update Children Consultation
  await db
    .update(products)
    .set({ images: ["/images/services/children-consultation.jpg"] })
    .where(eq(products.slug, "children-problems-consultation"));

  // Update Health Consultation
  await db
    .update(products)
    .set({ images: ["/images/services/health-consultation.jpg"] })
    .where(eq(products.slug, "health-problems-consultation"));

  // Update Financial Consultation (using career image as fallback or new one?)
  // For now let's leave financial empty or map it if we have an image.
  // We don't have a specific financial image, so skipping.

  console.log("✅ Updated all service images");
  console.log("Done!");
};

updateServiceImages();
