// Get image URL for a vehicle image
export const getImageUrl = query({
  args: {
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.imageId);
  },
});
import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

// Pricing tier validator
const pricingTierValidator = v.object({
  minDays: v.number(),
  maxDays: v.number(),
  pricePerDay: v.number(),
});

// Get all vehicles with pagination and filters
export const getAll = query({
  args: {
    paginationOpts: paginationOptsValidator,
    filters: v.optional(v.object({
      type: v.optional(v.union(
        v.literal("comfort"),
        v.literal("business"),
        v.literal("suv"),
        v.literal("premium"),
        v.literal("van")
      )),
      class: v.optional(
        v.union(
          v.literal("hatchback"),
          v.literal("sedan"),
          v.literal("suv"),
          v.literal("crossover"),
          v.literal("van"),
          v.literal("compact"),
        ),
      ),
      transmission: v.optional(
        v.union(v.literal("automatic"), v.literal("manual")),
      ),
      fuelType: v.optional(
        v.union(
          v.literal("petrol"),
          v.literal("diesel"),
          v.literal("electric"),
          v.literal("hybrid"),
          v.literal("benzina"),
        ),
      ),
    })),
  },
  handler: async (ctx, args) => {
    // TODO: Implement actual filtering and pagination logic
    return [];
  },
});

// Get all vehicles (deprecated - use getAll with pagination instead)
export const getAllVehicles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("vehicles").collect();
  },
});

// Get vehicle by ID
export const getById = query({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});




// Delete a vehicle
export const remove = mutation({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    // First, get the vehicle to check for images
    const vehicle = await ctx.db.get(args.id);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Delete all associated images from storage
    if (vehicle.images && vehicle.images.length > 0) {
      for (const imageId of vehicle.images) {
        await ctx.storage.delete(imageId);
      }
    }

    // Delete the vehicle
    await ctx.db.delete(args.id);
    return null;
  },
});

// Upload vehicle images
export const uploadImages = action({
  args: {
    vehicleId: v.id("vehicles"),
    images: v.array(v.bytes()),
    insertAtIndex: v.optional(v.number()), // Optional: where to insert the images in the order
  },
  handler: async (ctx, args) => {
    const { vehicleId, images, insertAtIndex } = args;

    // Get the current vehicle
    const vehicle = await ctx.runQuery(api.vehicles.getById, { id: vehicleId });
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Upload each image to storage
    const imageIds = [];
    for (const imageBytes of images) {
      const imageId = await ctx.storage.store(new Blob([imageBytes]));
      imageIds.push(imageId);
    }

    // Update the vehicle with new image IDs in the specified order
    const currentImages = vehicle.images || [];
    let newImages;

    if (
      insertAtIndex !== undefined &&
      insertAtIndex >= 0 &&
      insertAtIndex <= currentImages.length
    ) {
      // Insert at specific position
      newImages = [
        ...currentImages.slice(0, insertAtIndex),
        ...imageIds,
        ...currentImages.slice(insertAtIndex),
      ];
    } else {
      // Append to the end (default behavior)
      newImages = [...currentImages, ...imageIds];
    }


  // Sanitize class property before updating
  const allowedClasses = ["hatchback", "sedan", "suv", "crossover", "van", "compact"];
    let safeClass = vehicle.class;
    if (safeClass && !allowedClasses.includes(safeClass)) {
      safeClass = undefined;
    }

    // Cast to any to avoid type incompatibility between generated API types and current runtime data during migration
    await ctx.runMutation(api.vehicles.update, ({
      id: vehicleId,
      images: newImages,
      // Only include class if valid
      ...(safeClass ? { class: safeClass } : {}),
    } as any));

    return imageIds;
  },
});

// Reorder vehicle images
export const reorderImages = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    imageIds: v.array(v.id("_storage")), // Array of image IDs in the desired order
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { vehicleId, imageIds } = args;

    // Get the current vehicle
    const vehicle = await ctx.db.get(vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Verify all provided image IDs exist in the vehicle's current images
    const currentImages = vehicle.images || [];
    const invalidIds = imageIds.filter((id) => !currentImages.includes(id));
    if (invalidIds.length > 0) {
      throw new Error("Some image IDs do not belong to this vehicle");
    }

    // Verify we have all images (no missing images)
    if (imageIds.length !== currentImages.length) {
      throw new Error("Image reorder must include all existing images");
    }

    // Update the vehicle with the new image order
    await ctx.db.patch(vehicleId, {
      images: imageIds,
    });

    return null;
  },
});

// Remove a specific image from a vehicle
export const removeImage = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    imageId: v.id("_storage"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { vehicleId, imageId } = args;

    // Get the current vehicle
    const vehicle = await ctx.db.get(vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Check if the image exists in the vehicle's images
    const currentImages = vehicle.images || [];
    if (!currentImages.includes(imageId)) {
      throw new Error("Image not found in vehicle's images");
    }

    // Remove the image from the storage
    await ctx.storage.delete(imageId);

    // Remove the image from the vehicle's images array
    const updatedImages = currentImages.filter((id) => id !== imageId);

    // If this was the main image, clear the main image
    const updates: { images: typeof updatedImages; mainImageId?: undefined } = {
      images: updatedImages,
    };

    if (vehicle.mainImageId === imageId) {
      updates.mainImageId = undefined;
    }

    await ctx.db.patch(vehicleId, updates);

    return null;
  },
});

// Set main image
export const setMainImage = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { vehicleId, imageId } = args;

    // Verify the image exists in the vehicle's images array
    const vehicle = await ctx.db.get(vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    if (vehicle.images && !vehicle.images.includes(imageId)) {
      throw new Error("Image not found in vehicle's images");
    }

    // Set as main image
    return await ctx.db.patch(vehicleId, {
      mainImageId: imageId,
    });
  },
});

// Get image URL
export const create = mutation({
  args: {
    make: v.string(),
    model: v.string(),
    year: v.optional(v.number()),
    type: v.optional(v.union(
      v.literal("comfort"),
      v.literal("business"),
      v.literal("suv"),
      v.literal("premium"),
      v.literal("van")
    )),
    class: v.optional(v.union(
      v.literal("hatchback"),
      v.literal("sedan"),
      v.literal("suv"),
      v.literal("crossover"),
      v.literal("van"),
      v.literal("compact"),
    )),
    seats: v.optional(v.number()),
    transmission: v.optional(v.union(v.literal("automatic"), v.literal("manual"))),
    fuelType: v.optional(v.union(
      v.literal("diesel"),
      v.literal("electric"),
      v.literal("hybrid"),
      v.literal("benzina"),
    )),
    engineCapacity: v.optional(v.number()),
    engineType: v.optional(v.string()),
    pricePerDay: v.optional(v.number()),
    pricingTiers: v.array(pricingTierValidator),
    warranty: v.optional(v.number()),
    location: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    status: v.union(
      v.literal("available"),
      v.literal("rented"),
      v.literal("maintenance"),
    ),
  },
  handler: async (ctx, args) => {
  // Only allow valid class values
  const allowedClasses = ["hatchback", "sedan", "suv", "crossover", "van", "compact"];
    let filteredArgs = { ...args };
    if (filteredArgs.class && !allowedClasses.includes(filteredArgs.class)) {
      filteredArgs.class = undefined;
    }
    // Cast to any to satisfy TypeScript generated types while we clean up data via migrations
    return await ctx.db.insert("vehicles", {
      ...(filteredArgs as any),
      images: [], // Initialize empty images array
    } as any);
  },
});


// --- End of Migration ---

// Get vehicles by class (for ordering page)
export const update = mutation({
  args: {
    id: v.id("vehicles"),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    year: v.optional(v.number()),
    type: v.optional(v.union(
      v.literal("comfort"),
      v.literal("business"),
      v.literal("suv"),
      v.literal("premium"),
      v.literal("van")
    )),
    class: v.optional(v.union(
      v.literal("hatchback"),
      v.literal("sedan"),
      v.literal("suv"),
      v.literal("crossover"),
      v.literal("van"),
    )),
    seats: v.optional(v.number()),
    transmission: v.optional(v.union(v.literal("automatic"), v.literal("manual"))),
    fuelType: v.optional(v.union(
      v.literal("diesel"),
      v.literal("electric"),
      v.literal("hybrid"),
      v.literal("benzina"),
    )),
    engineCapacity: v.optional(v.number()),
    engineType: v.optional(v.string()),
    pricePerDay: v.optional(v.number()),
    pricingTiers: v.optional(v.array(pricingTierValidator)),
    warranty: v.optional(v.number()),
    location: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    status: v.optional(v.union(
      v.literal("available"),
      v.literal("rented"),
      v.literal("maintenance"),
    )),
    images: v.optional(v.array(v.id("_storage"))),
    mainImageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
  // Only allow valid class values
  const allowedClasses = ["hatchback", "sedan", "suv", "crossover", "van", "compact"];
    if (updates.class && !allowedClasses.includes(updates.class)) {
      updates.class = undefined;
    }
    // Cast updates to any to satisfy the Convex generated PatchValue type while cleaning data
    return await ctx.db.patch(id, updates as any);
  },
});
// Get all vehicles with their class information for public display
export const getAllVehiclesWithClasses = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("vehicles"),
      _creationTime: v.number(),
      make: v.string(),
      model: v.string(),
      year: v.optional(v.number()),
      type: v.optional(
        v.union(
          v.literal("comfort"),
          v.literal("business"),
          v.literal("suv"),
          v.literal("premium"),
          v.literal("van"),
        ),
      ),
      class: v.optional(
        v.union(
          v.literal("hatchback"),
          v.literal("sedan"),
          v.literal("suv"),
          v.literal("crossover"),
          v.literal("van"),
          v.literal("compact"),
        ),
      ),
      seats: v.optional(v.number()),
      transmission: v.optional(
        v.union(v.literal("automatic"), v.literal("manual")),
      ),
      fuelType: v.optional(
        v.union(
          v.literal("diesel"),
          v.literal("electric"),
          v.literal("hybrid"),
          v.literal("benzina"),
        ),
      ),
      engineCapacity: v.optional(v.number()),
      engineType: v.optional(v.string()),
      pricePerDay: v.optional(v.number()),
      pricingTiers: v.optional(
        v.array(
          v.object({
            minDays: v.number(),
            maxDays: v.number(),
            pricePerDay: v.number(),
          }),
        ),
      ),
      warranty: v.optional(v.number()),
  location: v.optional(v.string()),
      features: v.optional(v.array(v.string())),
      status: v.union(
        v.literal("available"),
        v.literal("rented"),
        v.literal("maintenance"),
      ),
      images: v.optional(v.array(v.id("_storage"))),
      mainImageId: v.optional(v.id("_storage")),
    }),
  ),
  handler: async (ctx) => {
    // Get all vehicles
    const vehicles = await ctx.db.query("vehicles").collect();
    return vehicles;
  },
});
