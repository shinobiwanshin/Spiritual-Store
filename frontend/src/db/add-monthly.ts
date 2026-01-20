import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { products, categories } from "./schema";
import "dotenv/config";

const addMonthlyKundali = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("Adding Monthly Kundali to database...");

  // Get services category
  const allCategories = await db.select().from(categories);
  const servicesCategory = allCategories.find(
    (c) => c.slug === "consultation-services",
  );

  if (!servicesCategory) {
    console.log("Services category not found");
    return;
  }

  await db
    .insert(products)
    .values({
      title: "Monthly Kundali Subscription",
      slug: "monthly-kundali",
      description:
        "Stay aligned with the cosmos every month! Receive your personalized Kundali chart based on the Telugu calendar delivered monthly. Plus, get 3 free consultation calls per year with our expert astrologers.",
      price: "499",
      originalPrice: null,
      discount: "Subscription",
      images: [],
      categoryId: servicesCategory.id,
      isLabCertified: false,
      rating: "5.0",
      reviewsCount: 0,
      benefits: [
        "Monthly Kundali chart (Telugu calendar)",
        "Personalized monthly predictions",
        "Auspicious dates & timings",
        "3 free consultation calls/year",
        "Email delivery",
        "Cancel anytime",
      ],
      howToWear: {
        icon: "calendar_month",
        color: "from-purple-500 to-violet-500",
      },
      zodiacCompatibility: [],
      stock: 999,
      productType: "service",
    })
    .onConflictDoNothing();

  console.log("✅ Monthly Kundali added to database!");
};

addMonthlyKundali();
