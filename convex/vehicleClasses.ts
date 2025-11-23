import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all vehicle classes
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("vehicleClasses")
      .order("desc")
      .collect();
  },
});

// Get all active vehicle classes sorted by sortIndex
export const getAllActive = query({
  args: {},
  handler: async (ctx) => {
    const classes = await ctx.db
      .query("vehicleClasses")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    
    // Sort by sortIndex
    return classes.sort((a, b) => a.sortIndex - b.sortIndex);
  },
});

// Get vehicle class by ID
export const getById = query({
  args: { id: v.id("vehicleClasses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new vehicle class
export const create = mutation({
  args: {
    name: v.string(),
    displayName: v.optional(v.string()),
    description: v.optional(v.string()),
    sortIndex: v.number(),
    isActive: v.boolean(),
    additional50kmPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if class with same name already exists
    const existing = await ctx.db
      .query("vehicleClasses")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
    
    if (existing) {
      throw new Error(`Vehicle class with name "${args.name}" already exists`);
    }

    return await ctx.db.insert("vehicleClasses", {
      name: args.name,
      displayName: args.displayName,
      description: args.description,
      sortIndex: args.sortIndex,
      isActive: args.isActive,
      additional50kmPrice: args.additional50kmPrice,
    });
  },
});

// Update a vehicle class
export const update = mutation({
  args: {
    id: v.id("vehicleClasses"),
    name: v.optional(v.string()),
    displayName: v.optional(v.string()),
    description: v.optional(v.string()),
    sortIndex: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    additional50kmPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // If updating name, check for duplicates
    if (updates.name !== undefined) {
      const existing = await ctx.db
        .query("vehicleClasses")
        .withIndex("by_name", (q) => q.eq("name", updates.name!))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error(`Vehicle class with name "${updates.name}" already exists`);
      }
    }

    await ctx.db.patch(id, updates);
  },
});

// Delete a vehicle class
export const remove = mutation({
  args: { id: v.id("vehicleClasses") },
  handler: async (ctx, args) => {
    // No need to check for vehicles using this class, as vehicles now use a string union for class
    await ctx.db.delete(args.id);
  },
});

// Initialize default vehicle classes
export const initializeDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const defaultClasses = [
      {
        name: "Hatchback",
        displayName: "Hatchback",
        description: "Compact and efficient hatchback vehicles",
        sortIndex: 1,
        isActive: true,
        additional50kmPrice: 15,
      },
      {
        name: "Sedan",
        displayName: "Sedan",
        description: "Comfortable sedan vehicles",
        sortIndex: 2,
        isActive: true,
        additional50kmPrice: 15,
      },
      {
        name: "SUV",
        displayName: "SUV",
        description: "Sport Utility Vehicles",
        sortIndex: 3,
        isActive: true,
        additional50kmPrice: 20,
      },
      {
        name: "Crossover",
        displayName: "Crossover",
        description: "Crossover vehicles",
        sortIndex: 4,
        isActive: true,
        additional50kmPrice: 18,
      },
      {
        name: "Van",
        displayName: "Van",
        description: "Large vans for groups and cargo",
        sortIndex: 5,
        isActive: true,
        additional50kmPrice: 25,
      },
    ];

    const existingClasses = await ctx.db.query("vehicleClasses").collect();
    
    // Only create classes that don't exist
    for (const classData of defaultClasses) {
      const exists = existingClasses.some((c) => c.name === classData.name);
      if (!exists) {
        await ctx.db.insert("vehicleClasses", classData);
      }
    }

    return { message: "Default vehicle classes initialized" };
  },
});
