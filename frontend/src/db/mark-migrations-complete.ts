import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { config } from "dotenv";
import * as fs from "fs";

/**
 * This script marks all existing migrations as complete in the database.
 * Use this when you have a database that was created with `db:push` but now
 * want to switch to using migrations.
 * 
 * It reads the migration journal and snapshots to get the correct hashes.
 */

// Load environment variables
const envResult = config({ path: ".env.local" });
if (envResult.error) {
  const fallbackResult = config();
  if (!fallbackResult.error) {
    console.log("📄 Loaded environment from .env (fallback)");
  }
}

async function markMigrationsComplete() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  console.log("⏳ Connecting to database...");
  const sqlClient = neon(process.env.DATABASE_URL);
  const db = drizzle(sqlClient);

  console.log("🧹 Cleaning up old migration tables...");
  await db.execute(sql`DROP TABLE IF EXISTS public."__drizzle_migrations"`);
  await db.execute(sql`DROP TABLE IF EXISTS drizzle."__drizzle_migrations"`);

  console.log("📁 Creating drizzle schema...");
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS drizzle`);

  console.log("📋 Creating __drizzle_migrations table in drizzle schema...");
  await db.execute(sql`
    CREATE TABLE drizzle."__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `);

  // Read journal to get migration metadata
  const journal = JSON.parse(
    fs.readFileSync("drizzle/meta/_journal.json", "utf8")
  );

  console.log("✅ Marking existing migrations as applied...");

  for (const entry of journal.entries) {
    // Read the snapshot to get the correct hash
    const snapshotPath = `drizzle/meta/${entry.tag.split("_")[0]}_snapshot.json`;
    const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));

    await db.execute(sql.raw(`
      INSERT INTO drizzle."__drizzle_migrations" (hash, created_at)
      VALUES ('${snapshot.id}', ${entry.when})
    `));

    console.log(`   ✓ ${entry.tag}`);
  }

  console.log("\n🎉 All migrations marked as complete!");
  console.log("💡 Future workflow:");
  console.log("   1. Modify src/db/schema.ts");
  console.log("   2. Run: npm run db:generate");
  console.log("   3. Run: npm run db:migrate");
}

markMigrationsComplete()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
