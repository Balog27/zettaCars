/**
 * Run both vehicle type and class migrations against a Convex deployment.
 * Usage: npx tsx scripts/run-migrations-all.ts
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const deploymentUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!deploymentUrl) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL not found in environment. Set it in .env.local (use the local Convex URL printed by `npx convex dev`).");
  process.exit(1);
}

const client = new ConvexHttpClient(deploymentUrl);

async function runAll() {
  console.log("🚀 Running vehicle type migration...");
  try {
    const res1 = await client.mutation(api.migrations.migrateVehicleTypes, {} as any);
    console.log(`✅ Types migrated: ${res1?.patched ?? "(no result)"}`);
  } catch (e) {
    console.error("Type migration failed:", e);
  }

  console.log("🚀 Running vehicle class migration...");
  try {
    // The migrateVehicleClasses mutation is exposed under a different module name in the generated api
    // Try both common mount points for safety.
    if ((api as any).migrations_migrateVehicleClasses && (api as any).migrations_migrateVehicleClasses.migrateVehicleClasses) {
      const res2 = await client.mutation((api as any).migrations_migrateVehicleClasses.migrateVehicleClasses, {} as any);
      console.log(`✅ Classes migrated: ${res2?.patched ?? "(no result)"}`);
    } else if ((api as any).migrations && (api as any).migrations.migrateVehicleClasses) {
      const res2 = await client.mutation((api as any).migrations.migrateVehicleClasses, {} as any);
      console.log(`✅ Classes migrated: ${res2?.patched ?? "(no result)"}`);
    } else {
      console.warn("⚠️ migrateVehicleClasses not found on generated api; skipping class migration.");
    }
  } catch (e) {
    console.error("Class migration failed:", e);
  }

  console.log("🎉 Migrations attempted. If patches were applied, remove temporary schema relaxations and regenerate types.");
}

runAll();
