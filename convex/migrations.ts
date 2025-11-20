import { action } from "./_generated/server";

// Map legacy vehicle type values to the new compact categories
const legacyToCompact: Record<string, string> = {
  sedan: "comfort",
  hatchback: "comfort",
  sports: "premium",
  truck: "van",
  suv: "suv",
  van: "van",
};

export const migrateVehicleTypes = action({
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
          await ctx.db.patch(vehicle._id, { type: mapped });
          patched++;
        } catch (err) {
          // If patch fails for any reason, continue and report later
          ctx.log?.error?.("Failed to patch vehicle", { id: vehicle._id, err });
        }
      }
    }

    return { patched };
  }
});
