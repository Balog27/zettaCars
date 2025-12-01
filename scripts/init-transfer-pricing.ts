/**
 * Initialize a default transferPricing document in Convex.
 * Usage: npx tsx scripts/init-transfer-pricing.ts
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const deploymentUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!deploymentUrl) {
  console.error("NEXT_PUBLIC_CONVEX_URL not set in .env.local. Run 'npx convex dev' and copy the URL to .env.local");
  process.exit(1);
}

const client = new ConvexHttpClient(deploymentUrl);

async function run() {
  try {
    console.log("Inserting default transfer pricing...");
    // Use init mutation which doesn't require an authenticated admin user
    const res = await client.mutation((api as any).transfers.initDefaultTransferPricing, {
      fixedPrices: { standard: 120, premium: 200, van: 150 },
      pricePerKm: { standard: 2, premium: 3.5, van: 2.5 },
      childSeatPrice: 15,
      currency: "RON",
    } as any);

    console.log("Result:", res);
    console.log("Default transfer pricing initialized.");
  } catch (err) {
    console.error("Failed to initialize pricing:", err);
    process.exit(1);
  }
}

run();
