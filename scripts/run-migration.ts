/**
 * Run this script to migrate vehicle types from legacy to compact categories
 * 
 * Usage: npx tsx scripts/run-migration.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: ".env.local" });

// Get your deployment URL from .env.local or pass it here
const deploymentUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!deploymentUrl) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL not found in environment");
  console.log("Please set it in your .env.local file or pass it as argument");
  process.exit(1);
}

const client = new ConvexHttpClient(deploymentUrl);

async function runMigration() {
  console.log("🚀 Starting vehicle type migration...");
  console.log(`📍 Convex deployment: ${deploymentUrl}\n`);

  try {
    const result = await client.mutation(api.migrations.migrateVehicleTypes, {});
    
    console.log("✅ Migration completed successfully!");
    console.log(`📊 Vehicles updated: ${result.patched}`);
    
    if (result.patched > 0) {
      console.log("\n✨ Next steps:");
      console.log("1. Remove legacy type literals from convex/schema.ts");
      console.log("2. Run: npx convex dev --once");
      console.log("3. Run: npm run build");
    } else {
      console.log("\n✨ No vehicles needed updating - all types are already compact!");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
