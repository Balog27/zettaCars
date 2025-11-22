import { mutation } from "./_generated/server";

// Compact categories used in the data model
type CompactVehicleType = "comfort" | "business" | "suv" | "premium" | "van";

// Map legacy vehicle type values to the new compact categories
const legacyToCompact: Record<string, CompactVehicleType> = {
  sedan: "comfort",
  hatchback: "comfort",
  sports: "premium",
  truck: "van",
  suv: "suv",
  van: "van",
};

export const migrateVehicleTypes = mutation({
  args: {},
  handler: async (ctx) => {
    // Fetch all vehicles
    const vehicles = await ctx.db.query("vehicles").collect();
    let patched = 0;

    for (const vehicle of vehicles) {
      const currentType = vehicle.type;
      if (!currentType) continue;

      const mapped = legacyToCompact[currentType];
      if (mapped && mapped !== currentType) {
        try {
          // Cast mapped to the compact union expected by the schema
          await ctx.db.patch(vehicle._id, { type: mapped as CompactVehicleType });
          patched++;
        } catch (err) {
          // If patch fails for any reason, continue and report later
          // Use console.error here because the Action/Mutation ctx may not expose a logger in this environment
          console.error("Failed to patch vehicle", { id: vehicle._id, err });
        }
      }
    }

    return { patched };
  }
});
