import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { config } from "dotenv";

// Load environment variables with error handling
const envResult = config({ path: ".env.local" });

if (envResult.error) {
  // In development, try fallback to .env
  if (process.env.NODE_ENV !== "production") {
    const fallbackResult = config();
    if (fallbackResult.error) {
      console.warn(
        "⚠️  No .env.local or .env file found. Using environment variables.",
      );
    } else {
      console.log("📄 Loaded environment from .env (fallback)");
    }
  }
} else {
  console.log("📄 Loaded environment from .env.local");
}

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not defined. Check your .env.local file or environment variables.",
    );
  }

  console.log("⏳ Connecting to Neon database...");

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  console.log("🚀 Running migrations...");

  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

runMigrate().catch((err) => {
  console.error("❌ Migration setup error:", err);
  process.exit(1);
});
