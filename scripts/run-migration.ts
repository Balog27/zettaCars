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
  // Allow choosing which migration to run via MIGRATION env var.
  // Supported: migrateVehicleTypes (default), migrateRemoveIsOwner
  const migrationName = process.env.MIGRATION || "migrateVehicleTypes";
  console.log(`🚀 Starting migration: ${migrationName}`);
  console.log(`📍 Convex deployment: ${deploymentUrl}\n`);

  try {
    let result: any;
    if (migrationName === "migrateRemoveIsOwner") {
      result = await client.mutation(api.migrations.migrateRemoveIsOwner, {});
      console.log("✅ migrateRemoveIsOwner completed");
      console.log(`📊 Vehicles patched (isOwner removed): ${result.patched}`);
      console.log("\n✨ Next steps:");
      console.log("1. Verify in Convex dashboard that vehicles no longer contain `isOwner`");
      console.log("2. Re-run: npx convex deploy to push the tightened schema");
    } else {
      result = await client.mutation(api.migrations.migrateVehicleTypes, {});
      console.log("✅ migrateVehicleTypes completed");
      console.log(`📊 Vehicles updated: ${result.patched}`);
      console.log("\n✨ Next steps:");
      console.log("1. Remove legacy type literals from convex/schema.ts");
      console.log("2. Run: npx convex dev --once");
      console.log("3. Run: npm run build");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
