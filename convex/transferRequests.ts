import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

// --- CREATE ---
export const createTransferRequest = mutation({
  args: {
    userId: v.optional(v.id("users")),
    transferDate: v.string(), // ISO date string "2025-03-15"
    transferTime: v.string(), // Time in "HH:MM" format
    pickupLocation: v.string(),
    dropoffLocation: v.string(),
    numberOfPassengers: v.number(),
    category: v.union(
      v.literal("standard"),
      v.literal("van")
    ),
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      message: v.optional(v.string()),
      flightNumber: v.optional(v.string()),
    }),
    estimatedPrice: v.optional(v.number()),
    currency: v.optional(v.string()),
    distanceKm: v.optional(v.number()),
    specialRequests: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const newTransferRequest = {
      userId: currentUser?._id || undefined,
      status: "pending" as const,
      transferDate: args.transferDate,
      transferTime: args.transferTime,
      pickupLocation: args.pickupLocation,
      dropoffLocation: args.dropoffLocation,
      numberOfPassengers: args.numberOfPassengers,
      category: args.category,
      customerInfo: args.customerInfo,
      estimatedPrice: args.estimatedPrice,
      finalPrice: undefined,
      currency: args.currency || "EUR",
      distanceKm: args.distanceKm,
      specialRequests: args.specialRequests,
    };

    const transferRequestId = await ctx.db.insert("transferRequests", newTransferRequest);

    return { transferRequestId };
  },
});

// --- READ ---
export const getTransferRequestById = query({
  args: { transferRequestId: v.id("transferRequests") },
  handler: async (ctx, args) => {
    const transferRequest = await ctx.db.get(args.transferRequestId);
    if (!transferRequest) return null;

    const currentUser = await getCurrentUser(ctx);

    if (currentUser) {
      if (currentUser.role === "admin" || transferRequest.userId === currentUser._id) {
        return transferRequest;
      } else {
        throw new Error("User not authorized to view this transfer request.");
      }
    } else {
      if (!transferRequest.userId) {
        return transferRequest;
      } else {
        throw new Error("Authentication required to view this transfer request.");
      }
    }
  },
});

export const getCurrentUserTransferRequests = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db
      .query("transferRequests")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getAllTransferRequests = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user || user.role !== "admin") {
      return [];
    }

    return await ctx.db.query("transferRequests").order("desc").collect();
  },
});

// --- UPDATE ---
export const updateTransferRequestStatus = mutation({
  args: {
    transferRequestId: v.id("transferRequests"),
    newStatus: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const transferRequest = await ctx.db.get(args.transferRequestId);
    if (!transferRequest) {
      throw new Error("Transfer request not found.");
    }

    if (transferRequest.userId !== user._id && user.role !== "admin") {
      throw new Error("User not authorized to update this transfer request status.");
    }

    await ctx.db.patch(args.transferRequestId, { status: args.newStatus });

    return { success: true };
  },
});

export const updateTransferRequestPrice = mutation({
  args: {
    transferRequestId: v.id("transferRequests"),
    finalPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (user.role !== "admin") {
      throw new Error("User not authorized (admin only).");
    }

    const transferRequest = await ctx.db.get(args.transferRequestId);
    if (!transferRequest) {
      throw new Error("Transfer request not found.");
    }

    await ctx.db.patch(args.transferRequestId, { finalPrice: args.finalPrice });

    return { success: true };
  },
});

// --- DELETE ---
export const cancelTransferRequest = mutation({
  args: { transferRequestId: v.id("transferRequests") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const transferRequest = await ctx.db.get(args.transferRequestId);
    if (!transferRequest) {
      throw new Error("Transfer request not found.");
    }

    if (user.role !== "admin" && (transferRequest.status === "completed" || transferRequest.status === "cancelled")) {
      throw new Error(`Transfer request is already ${transferRequest.status} and cannot be modified by user.`);
    }

    await ctx.db.patch(args.transferRequestId, { status: "cancelled" as const });

    return { success: true, message: "Transfer request cancelled." };
  },
});

export const deleteTransferRequestPermanently = mutation({
  args: { transferRequestId: v.id("transferRequests") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (!user || user.role !== "admin") {
      throw new Error("User not authorized (admin only).");
    }

    const transferRequest = await ctx.db.get(args.transferRequestId);
    if (!transferRequest) {
      return { success: true, message: "Transfer request not found or already deleted." };
    }

    await ctx.db.delete(args.transferRequestId);

    return { success: true, message: "Transfer request permanently deleted." };
  },
});
