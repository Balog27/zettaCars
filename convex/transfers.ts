import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

// Return shape validator for pricing
const pricingValidator = v.object({
  _id: v.optional(v.id("transferPricing")),
  _creationTime: v.optional(v.number()),
  key: v.string(),
  fixedPrices: v.object({
    standard: v.number(),
    premium: v.number(),
    van: v.number(),
  }),
  pricePerKm: v.object({
    standard: v.number(),
    premium: v.number(),
    van: v.number(),
  }),
  childSeatPrice: v.optional(v.number()),
  currency: v.optional(v.string()),
});

export const getTransferPricing = query({
  args: {},
  returns: v.union(pricingValidator, v.null()),
  handler: async (ctx) => {
    // Return the pricing doc with key 'default' if present
    const doc = await ctx.db
      .query("transferPricing")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();

    return doc || null;
  },
});

export const updateTransferPricing = mutation({
  args: {
    fixedPrices: v.object({
      standard: v.number(),
      premium: v.number(),
      van: v.number(),
    }),
    pricePerKm: v.object({
      standard: v.number(),
      premium: v.number(),
      van: v.number(),
    }),
    childSeatPrice: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("User not authorized (admin only).");
    }

    // Check if a default doc exists
    const existing = await ctx.db
      .query("transferPricing")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();

    const payload = {
      key: "default",
      fixedPrices: args.fixedPrices,
      pricePerKm: args.pricePerKm,
      childSeatPrice: args.childSeatPrice,
      currency: args.currency || "RON",
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload as any);
    } else {
      await ctx.db.insert("transferPricing", payload as any);
    }

    return { success: true };
  },
});

// Initialization helper: insert a default pricing document if none exists.
// This mutation intentionally does not require auth so local setup scripts
// can initialize the DB during development. Do NOT expose this in production
// without proper safeguards.
export const initDefaultTransferPricing = mutation({
  args: {
    fixedPrices: v.object({
      standard: v.number(),
      premium: v.number(),
      van: v.number(),
    }),
    pricePerKm: v.object({
      standard: v.number(),
      premium: v.number(),
      van: v.number(),
    }),
    childSeatPrice: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    // Only insert if default key doesn't exist
    const existing = await ctx.db
      .query("transferPricing")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();

    if (existing) {
      return { success: true };
    }

    await ctx.db.insert("transferPricing", {
      key: "default",
      fixedPrices: args.fixedPrices,
      pricePerKm: args.pricePerKm,
      childSeatPrice: args.childSeatPrice,
      currency: args.currency || "RON",
    } as any);

    return { success: true };
  },
});
