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
  // ctx typing here may not expose db in generated types for this migration file;
  // cast to any to access db at runtime.
  const vehicles = await (ctx as any).db.query("vehicles").collect();
    let patched = 0;

    for (const vehicle of vehicles) {
      const currentType = vehicle.type;
      if (!currentType) continue;

      const mapped = legacyToCompact[currentType];
      if (mapped && mapped !== currentType) {
        try {
          // Cast mapped to the compact union expected by the schema
          await (ctx as any).db.patch(vehicle._id, { type: mapped as CompactVehicleType });
          patched++;
        } catch (err) {
          // If patch fails for any reason, continue and report later
          // Try to use the runtime logger if available, otherwise fallback to console.error
          try {
            (ctx as any).log?.error?.("Failed to patch vehicle", { id: vehicle._id, err });
          } catch (e) {
            console.error("Failed to patch vehicle", { id: vehicle._id, err });
          }
        }
      }
    }

    return { patched };
  }
});

export { migrateVehicleClasses };
