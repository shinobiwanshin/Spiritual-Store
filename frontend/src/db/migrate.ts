import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  console.log("⏳ Connecting to Neon database...");

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("🚀 Running migrations...");

  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

runMigrate();
