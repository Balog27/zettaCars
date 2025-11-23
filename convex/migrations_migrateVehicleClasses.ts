import { mutation } from "./_generated/server";

// Allowed vehicle classes in the new schema
const allowedClasses = [
  "hatchback",
  "sedan",
  "suv",
  "crossover",
  "van",
] as const;
type AllowedClass = typeof allowedClasses[number];

// Map legacy class values to a valid new class (default to 'hatchback' if unknown)
function mapLegacyClass(cls: string | undefined): AllowedClass {
  if (!cls) return "hatchback";
  if (allowedClasses.includes(cls as AllowedClass)) return cls as AllowedClass;
  // Map some common legacy values if needed
  switch (cls) {
    case "compact":
    case "economy":
    case "intermediate":
    case "standard":
    case "full-size":
    case "luxury":
    case "sport":
    case "executive":
    case "commercial":
    case "super-sport":
    case "supercars":
    case "convertible":
    case "business":
    case "premium":
      return "hatchback";
    case "van":
      return "van";
    case "suv":
      return "suv";
    case "sedan":
      return "sedan";
    case "crossover":
      return "crossover";
    default:
      return "hatchback";
  }
}

export const migrateVehicleClasses = mutation({
  args: {},
  handler: async (ctx) => {
    const vehicles = await ctx.db.query("vehicles").collect();
    let patched = 0;
    for (const vehicle of vehicles) {
      const currentClass = vehicle.class;
      if (!currentClass || (allowedClasses as readonly string[]).includes(currentClass)) continue;
      const mapped = mapLegacyClass(currentClass);
      try {
        await ctx.db.patch(vehicle._id, { class: mapped });
        patched++;
      } catch (err) {
        console.error("Failed to patch vehicle class", { id: vehicle._id, err });
      }
    }
    return { patched };
  },
});
