import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { products, categories } from "./schema";
import "dotenv/config";

const addSampurnaKundali = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("Adding Sampurna Kundali to database...");

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
      title: "Sampurna Kundali",
      slug: "sampurna-kundali",
      description:
        "Get a complete personalized consultation with our expert Vedic astrologer. Enjoy unlimited call time to discuss all aspects of your life. If you have any doubts or missed points, we offer a free follow-up call with unlimited time!",
      price: "2999",
      originalPrice: "4999",
      discount: "40% OFF",
      images: ["/images/services/sampurna-kundali.jpg"],
      categoryId: servicesCategory.id,
      isLabCertified: false,
      rating: "5.0",
      reviewsCount: 0,
      benefits: [
        "Live call with expert astrologer",
        "No time limit on consultation",
        "Complete birth chart analysis",
        "All life areas covered",
        "Personalized remedies & mantras",
        "Free follow-up call if needed",
      ],
      howToWear: { icon: "call", color: "from-primary to-orange-500" },
      zodiacCompatibility: [],
      stock: 999,
      productType: "service",
    })
    .onConflictDoNothing();

  console.log("✅ Sampurna Kundali added to database!");
};

addSampurnaKundali();
