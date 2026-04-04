import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

// --- ADMIN CRUD ---

export const createVoucher = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    startDate: v.number(),
    expiryDate: v.optional(v.number()),
    type: v.union(v.literal("percentage"), v.literal("fixed")),
    value: v.number(),
    minOrderPrice: v.optional(v.number()),
    eligibleServices: v.array(v.union(v.literal("rents"), v.literal("transfers"))),
    active: v.boolean(),
    maxUsage: v.optional(v.number()),
    usesPerAccount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (user.role !== "admin") {
      throw new Error("Only admins can create vouchers");
    }

    // Check if code already exists
    const existing = await ctx.db
      .query("vouchers")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();
    
    if (existing) {
      throw new Error("Voucher code already exists");
    }

    return await ctx.db.insert("vouchers", {
      ...args,
      usageCount: 0,
    });
  },
});

export const updateVoucher = mutation({
  args: {
    id: v.id("vouchers"),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    startDate: v.optional(v.number()),
    expiryDate: v.optional(v.number()),
    type: v.optional(v.union(v.literal("percentage"), v.literal("fixed"))),
    value: v.optional(v.number()),
    minOrderPrice: v.optional(v.number()),
    eligibleServices: v.optional(v.array(v.union(v.literal("rents"), v.literal("transfers")))),
    active: v.optional(v.boolean()),
    maxUsage: v.optional(v.number()),
    usesPerAccount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (user.role !== "admin") {
      throw new Error("Only admins can update vouchers");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteVoucher = mutation({
  args: { id: v.id("vouchers") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (user.role !== "admin") {
      throw new Error("Only admins can delete vouchers");
    }

    await ctx.db.delete(args.id);
  },
});

export const getAllVouchers = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (user.role !== "admin") {
      return [];
    }
    return await ctx.db.query("vouchers").order("desc").collect();
  },
});

// --- USER QUERIES ---

export const getVoucherByCode = query({
  args: { 
    code: v.string(),
    serviceType: v.union(v.literal("rents"), v.literal("transfers")),
    orderPrice: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.optional(v.string()),
    voucherId: v.optional(v.id("vouchers")),
    type: v.optional(v.union(v.literal("percentage"), v.literal("fixed"))),
    value: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
  }),
  handler: async (ctx, args) => {
    try {
      const voucher = await ctx.db
        .query("vouchers")
        .withIndex("by_code", (q) => q.eq("code", args.code))
        .filter((q) => q.eq(q.field("active"), true))
        .first();

      if (!voucher) {
        return { success: false, message: "Invalid or inactive voucher code" };
      }

      const now = Date.now();

      // Check dates
      if (voucher.startDate && now < voucher.startDate) {
        return { success: false, message: "Voucher is not yet active" };
      }
      if (voucher.expiryDate && now > voucher.expiryDate) {
        return { success: false, message: "Voucher has expired" };
      }

      // Check usage
      if (voucher.maxUsage !== undefined && (voucher.usageCount ?? 0) >= voucher.maxUsage) {
        return { success: false, message: "Voucher usage limit reached" };
      }

      // Check eligibility
      if (!voucher.eligibleServices?.includes(args.serviceType)) {
        return { success: false, message: `Voucher is not eligible for ${args.serviceType}` };
      }

      // Check min order price
      if (voucher.minOrderPrice !== undefined && args.orderPrice < voucher.minOrderPrice) {
        return { 
          success: false, 
          message: `Minimum order price for this voucher is ${voucher.minOrderPrice}` 
        };
      }

      // Check per-account usage
      if (voucher.usesPerAccount !== undefined) {
        const currentUser = await getCurrentUser(ctx);
        if (!currentUser) {
          return { success: false, message: "This voucher requires a user account. Please log in." };
        }

        const prevReservations = await ctx.db
          .query("reservations")
          .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
          .filter((q) => q.eq(q.field("voucherId"), voucher._id))
          .collect();

        const prevTransfers = await ctx.db
          .query("transferRequests")
          .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
          .filter((q) => q.eq(q.field("voucherId"), voucher._id))
          .collect();

        const userUsageCount = prevReservations.length + prevTransfers.length;

        if (userUsageCount >= voucher.usesPerAccount) {
          return { 
            success: false, 
            message: `You have already used this voucher ${userUsageCount} time(s) on your account.` 
          };
        }
      }

      // Calculate discount
      let discountAmount = 0;
      if (voucher.type === "percentage") {
        discountAmount = (args.orderPrice * (voucher.value ?? 0)) / 100;
      } else {
        discountAmount = voucher.value ?? 0;
      }

      // Ensure discount doesn't exceed order price
      discountAmount = Math.min(discountAmount, args.orderPrice);

      return {
        success: true,
        voucherId: voucher._id,
        type: voucher.type || "fixed",
        value: voucher.value || 0,
        discountAmount: Math.round(discountAmount * 100) / 100,
      };
    } catch (error: any) {
      console.error("Error getting voucher:", error);
      return { success: false, message: error.message || "An unexpected error occurred" };
    }
  },
});

export const checkVoucher = mutation({
  args: { 
    code: v.string(),
    serviceType: v.union(v.literal("rents"), v.literal("transfers")),
    orderPrice: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.optional(v.string()),
    voucherId: v.optional(v.id("vouchers")),
    type: v.optional(v.union(v.literal("percentage"), v.literal("fixed"))),
    value: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
  }),
  handler: async (ctx, args) => {
    try {
      const voucher = await ctx.db
        .query("vouchers")
        .withIndex("by_code", (q) => q.eq("code", args.code))
        .filter((q) => q.eq(q.field("active"), true))
        .first();

      if (!voucher) {
        return { success: false, message: "Invalid or inactive voucher code" };
      }

      const now = Date.now();

      // Check dates
      if (voucher.startDate && now < voucher.startDate) {
        return { success: false, message: "Voucher is not yet active" };
      }
      if (voucher.expiryDate && now > voucher.expiryDate) {
        return { success: false, message: "Voucher has expired" };
      }

      // Check usage
      if (voucher.maxUsage !== undefined && (voucher.usageCount ?? 0) >= voucher.maxUsage) {
        return { success: false, message: "Voucher usage limit reached" };
      }

      // Check eligibility
      if (!voucher.eligibleServices?.includes(args.serviceType)) {
        return { success: false, message: `Voucher is not eligible for ${args.serviceType}` };
      }

      // Check min order price
      if (voucher.minOrderPrice !== undefined && args.orderPrice < voucher.minOrderPrice) {
        return { 
          success: false, 
          message: `Minimum order price for this voucher is ${voucher.minOrderPrice}` 
        };
      }

      // Check per-account usage
      if (voucher.usesPerAccount !== undefined) {
        const currentUser = await getCurrentUser(ctx);
        if (!currentUser) {
          return { success: false, message: "This voucher requires a user account. Please log in." };
        }

        const prevReservations = await ctx.db
          .query("reservations")
          .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
          .filter((q) => q.eq(q.field("voucherId"), voucher._id))
          .collect();

        const prevTransfers = await ctx.db
          .query("transferRequests")
          .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
          .filter((q) => q.eq(q.field("voucherId"), voucher._id))
          .collect();

        const userUsageCount = prevReservations.length + prevTransfers.length;

        if (userUsageCount >= voucher.usesPerAccount) {
          return { 
            success: false, 
            message: `You have already used this voucher ${userUsageCount} time(s) on your account.` 
          };
        }
      }

      // Calculate discount
      let discountAmount = 0;
      if (voucher.type === "percentage") {
        discountAmount = (args.orderPrice * (voucher.value ?? 0)) / 100;
      } else {
        discountAmount = voucher.value ?? 0;
      }

      // Ensure discount doesn't exceed order price
      discountAmount = Math.min(discountAmount, args.orderPrice);

      return {
        success: true,
        voucherId: voucher._id,
        type: voucher.type || "fixed",
        value: voucher.value || 0,
        discountAmount: Math.round(discountAmount * 100) / 100,
      };
    } catch (error: any) {
      console.error("Error checking voucher:", error);
      return { success: false, message: error.message || "An unexpected error occurred" };
    }
  },
});
