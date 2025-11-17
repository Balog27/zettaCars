import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Public query: return recent approved reviews ordered by createdAt desc
export const getPublicReviews = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    // Filter approved and return up to limit
    return reviews.filter(r => r.approved).slice(0, limit).map(r => ({
      text: r.text,
      name: r.name,
      title: r.title || "",
      rating: r.rating,
      createdAt: r.createdAt,
    }));
  },
});

// Create a review - by default create as approved so it appears immediately.
export const createReview = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    rating: v.number(),
    title: v.optional(v.string()),
    text: v.string(),
    locale: v.optional(v.union(v.literal("en"), v.literal("ro"))),
    source: v.optional(v.string()),
    approved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const approved = args.approved ?? true; // show immediately by default

    const doc = {
      name: args.name,
      email: args.email,
      rating: args.rating,
      title: args.title,
      text: args.text,
      locale: args.locale,
      source: args.source,
      approved,
      createdAt: now,
    };

    const id = await ctx.db.insert("reviews", doc);
    return { reviewId: id, success: true };
  },
});
