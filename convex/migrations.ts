import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { migrateVehicleClasses } from "./migrations_migrateVehicleClasses";

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
  returns: v.object({
    patched: v.number(),
  }),
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

// Remove `isOwner` field from all vehicle documents. This will unset the field so the
// schema can be tightened. It is safe to run multiple times.
export const migrateRemoveIsOwner = mutation({
  args: {},
  returns: v.object({ patched: v.number() }),
  handler: async (ctx) => {
    const vehicles = await ctx.db.query("vehicles").collect();
    let patched = 0;

    for (const vehicle of vehicles) {
      // Only patch when the document actually has the isOwner property set
      if (Object.prototype.hasOwnProperty.call(vehicle, "isOwner")) {
        try {
          // Setting the field to undefined removes it from the document
          await ctx.db.patch(vehicle._id, { isOwner: undefined } as any);
          patched++;
        } catch (err) {
          console.error("Failed to remove isOwner for vehicle", { id: vehicle._id, err });
        }
      }
    }

    return { patched };
  },
});

export { migrateVehicleClasses };
