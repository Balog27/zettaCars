import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

// --- CREATE ---
export const createTransferRequest = mutation({
  args: {
    userId: v.optional(v.id("users")),
    rideType: v.union(v.literal("one-way"), v.literal("round-trip")),
    segments: v.array(
      v.object({
        from: v.string(),
        to: v.string(),
        distanceKm: v.number(),
        durationText: v.optional(v.string()),
        waitingTime: v.optional(v.number()),
      })
    ),
    waitingTotalHours: v.number(),
    totalDistanceKm: v.number(),
    passengers: v.number(),
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
    voucherId: v.optional(v.id("vouchers")),
    voucherCode: v.optional(v.string()),
    discountAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const newTransferRequest = {
      userId: currentUser?._id || undefined,
      status: "pending" as const,
      rideType: args.rideType,
      segments: args.segments,
      waitingTotalHours: args.waitingTotalHours,
      totalDistanceKm: args.totalDistanceKm,
      passengers: args.passengers,
      category: args.category,
      customerInfo: args.customerInfo,
      estimatedPrice: args.estimatedPrice,
      finalPrice: undefined,
      currency: args.currency || "EUR",
      voucherId: args.voucherId,
      voucherCode: args.voucherCode,
      discountAmount: args.discountAmount,
    };

    const transferRequestId = await ctx.db.insert("transferRequests", (newTransferRequest as any));

    // Update voucher usage count if applicable
    if (args.voucherId) {
      const voucher = await ctx.db.get(args.voucherId);
      if (voucher) {
        await ctx.db.patch(args.voucherId, {
          usageCount: (voucher.usageCount || 0) + 1,
        });
      }
    }

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

export const updateTransferRequestVoucher = mutation({
  args: {
    transferRequestId: v.id("transferRequests"),
    voucherId: v.id("vouchers"),
    voucherCode: v.string(),
    discountAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    
    const request = await ctx.db.get(args.transferRequestId);
    if (!request) throw new Error("Transfer request not found");

    if (user.role !== "admin" && request.userId !== user._id) {
       throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.transferRequestId, {
      voucherId: args.voucherId,
      voucherCode: args.voucherCode,
      discountAmount: args.discountAmount,
      // If finalPrice is already set, we might need to adjust it, 
      // but usually voucher is applied before final confirmation.
    });

    return { success: true };
  },
});
