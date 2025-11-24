/**
 * Export all vehicles from a Convex deployment to a JSON file.
 * Usage: 
 *   $env:NEXT_PUBLIC_CONVEX_URL = "<session-only-convex-url>"
 *   npx tsx scripts/export-vehicles.ts
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const deploymentUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!deploymentUrl) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL not found in environment");
  console.log("Please set it in your .env.local file or export it in the shell before running this script.");
  process.exit(1);
}

const client = new ConvexHttpClient(deploymentUrl);

async function run() {
  console.log(`📍 Convex deployment: ${deploymentUrl}`);
  try {
    console.log("🔎 Fetching vehicles...");
    // Use the generated API query if available. Fallback to 'vehicles.getAllVehicles' shape.
    const vehicles = await client.query((api as any).vehicles.getAllVehicles);
    const outDir = path.resolve(process.cwd(), "tmp");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const filePath = path.join(outDir, `vehicles-${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(vehicles ?? [], null, 2), "utf-8");
    console.log(`✅ Exported ${Array.isArray(vehicles) ? vehicles.length : "(unknown)"} vehicles to ${filePath}`);
  } catch (err) {
    console.error("❌ Failed to export vehicles:", err);
    process.exit(1);
  }
}

run();
