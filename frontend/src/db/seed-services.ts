import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { products, categories, type NewProduct } from "./schema";
import "dotenv/config";

// Service definitions
const servicesData = [
  {
    title: "Health Problems Consultation",
    slug: "health-problems-consultation",
    description:
      "Our health readings provide insights into potential health issues and suggest preventive measures. By analyzing your birth chart, we can identify vulnerable areas and recommend Ayurvedic remedies, gemstones, and mantras for better health.",
    price: "1499",
    icon: "favorite",
    benefits: [
      "Health Analysis based on birth chart",
      "Ayurvedic Remedies",
      "Healing Mantras",
      "Gemstone Suggestions",
    ],
    color: "from-red-500 to-rose-600",
  },
  {
    title: "Career Problems Consultation",
    slug: "career-problems-consultation",
    description:
      "Career decisions can shape your entire life. Our astrological readings offer insights into your career potential, identifying the best times for job changes, business ventures, and professional growth opportunities.",
    price: "1499",
    icon: "work",
    benefits: [
      "Career Path Analysis",
      "Job Change Timing",
      "Business Guidance",
      "Success Mantras",
    ],
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Family Problems Consultation",
    slug: "family-problems-consultation",
    description:
      "Family dynamics can be complex and challenging. Our astrological readings help you understand the underlying causes of family conflicts and provide remedies to restore harmony and peace in your household.",
    price: "1499",
    icon: "family_restroom",
    benefits: [
      "Family Harmony Analysis",
      "Conflict Resolution",
      "Relationship Remedies",
      "Peace Mantras",
    ],
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Children Problems Consultation",
    slug: "children-problems-consultation",
    description:
      "Understand your child's potential, strengths, and challenges through Vedic astrology. We provide guidance on education, behavior, health, and overall development based on their birth chart.",
    price: "1499",
    icon: "child_care",
    benefits: [
      "Child's Potential Analysis",
      "Education Guidance",
      "Behavior Insights",
      "Development Tips",
    ],
    color: "from-yellow-500 to-amber-600",
  },
  {
    title: "Marital Problems Consultation",
    slug: "marital-problems-consultation",
    description:
      "Marriage is a sacred bond that requires nurturing. Our readings analyze compatibility issues, timing for marriage, and provide remedies to strengthen your marital relationship and resolve conflicts.",
    price: "1999",
    icon: "favorite_border",
    benefits: [
      "Compatibility Analysis",
      "Marriage Timing",
      "Relationship Remedies",
      "Love Mantras",
    ],
    color: "from-pink-500 to-rose-600",
  },
  {
    title: "Education Problems Consultation",
    slug: "education-problems-consultation",
    description:
      "Education is a critical aspect of your or your child's future. Our readings can help understand strengths and weaknesses, offering guidance on the best educational paths and how to overcome academic obstacles.",
    price: "1499",
    icon: "school",
    benefits: [
      "Academic Analysis",
      "Subject Selection",
      "Exam Success Tips",
      "Knowledge Mantras",
    ],
    color: "from-purple-500 to-violet-600",
  },
  {
    title: "Financial Problems Consultation",
    slug: "financial-problems-consultation",
    description:
      "Financial stability is essential for peace of mind. Our readings identify periods of financial gain or loss, investment opportunities, and provide remedies to attract wealth and prosperity.",
    price: "1999",
    icon: "account_balance",
    benefits: [
      "Wealth Analysis",
      "Investment Timing",
      "Prosperity Remedies",
      "Lakshmi Mantras",
    ],
    color: "from-emerald-500 to-teal-600",
  },
];

const seedServices = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  console.log("⏳ Connecting to Neon database...");

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("🚀 Seeding services...");

  try {
    // Create or get "Services" category
    await db
      .insert(categories)
      .values({
        name: "Consultation Services",
        slug: "consultation-services",
        description:
          "Vedic astrology consultation services for all life problems",
      })
      .onConflictDoNothing();

    const allCategories = await db.select().from(categories);
    const servicesCategory = allCategories.find(
      (c) => c.slug === "consultation-services",
    );

    if (!servicesCategory) {
      throw new Error("Could not create services category");
    }

    // Insert services as products with type 'service'
    for (const s of servicesData) {
      const productValues: NewProduct = {
        title: s.title,
        slug: s.slug,
        description: s.description,
        price: s.price,
        originalPrice: null,
        discount: null,
        images: [], // Services don't have images
        categoryId: servicesCategory.id,
        isLabCertified: false,
        rating: "5.0",
        reviewsCount: 0,
        benefits: s.benefits,
        howToWear: { icon: s.icon, color: s.color }, // Store icon/color in howToWear JSON
        zodiacCompatibility: [],
        stock: 999, // Unlimited for services
        productType: "service",
      };

      await db
        .insert(products)
        .values(productValues)
        .onConflictDoUpdate({
          target: products.slug,
          set: {
            ...productValues,
            updatedAt: new Date(),
          },
        });

      console.log(`✅ Inserted service: ${s.title}`);
    }

    console.log("🎉 Services seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding services:", error);
    throw error;
  }
};

seedServices();
