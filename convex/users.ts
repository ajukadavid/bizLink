import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertAuthenticatedUser } from "./accessControl";
import { emitAuditLog } from "./audit";

/**
 * Ensure user exists in Convex database after Clerk authentication
 * This mutation is called automatically on first Clerk login to sync the user
 */
export const ensureUserExists = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new user with default role (business_owner)
    // Role assignment should be done through a controlled admin flow
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      role: "user", // Default role, triggers onboarding flow
      status: "active",
    });

    // Audit log: User registration
    await emitAuditLog(ctx, {
      actorId: args.clerkId,
      action: "USER_REGISTERED",
      entityId: userId,
      newState: "active",
      metadata: {
        email: args.email,
        defaultRole: "user",
      },
    });

    return userId;
  },
});

/**
 * Get current authenticated user
 * Returns null if not authenticated (handles race condition on page load)
 */
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null; // Return null instead of throwing to handle auth loading state
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return null; // User not synced yet
    }

    if (user.status !== "active") {
      return null; // User suspended
    }

    return user;
  },
});

/**
 * Update user role (admin only)
 * This is a controlled flow for assigning roles
 */
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    newRole: v.union(
      v.literal("admin"),
      v.literal("regulator"),
      v.literal("investor"),
      v.literal("business_owner")
    ),
    jurisdiction: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Only admins can change roles
    const admin = await assertAuthenticatedUser(ctx);
    if (admin.role !== "admin") {
      throw new Error("Unauthorized: Only admins can change user roles");
    }

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const previousRole = user.role;
    const previousJurisdiction = user.jurisdiction;

    // Update user role
    await ctx.db.patch(args.userId, {
      role: args.newRole,
      jurisdiction: args.jurisdiction,
    });

    // Audit log: Role change
    await emitAuditLog(ctx, {
      actorId: admin.clerkId,
      action: "USER_ROLE_CHANGED",
      entityId: args.userId,
      previousState: previousRole,
      newState: args.newRole,
      metadata: {
        targetUserId: args.userId,
        targetUserEmail: user.email,
        previousJurisdiction,
        newJurisdiction: args.jurisdiction,
      },
    });

    return { success: true };
  },
});

/**
 * Update user status (admin only)
 */
export const updateUserStatus = mutation({
  args: {
    userId: v.id("users"),
    status: v.union(v.literal("active"), v.literal("suspended")),
  },
  handler: async (ctx, args) => {
    // Only admins can change user status
    const admin = await assertAuthenticatedUser(ctx);
    if (admin.role !== "admin") {
      throw new Error("Unauthorized: Only admins can change user status");
    }

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const previousStatus = user.status;

    await ctx.db.patch(args.userId, {
      status: args.status,
    });

    // Audit log: Status change
    await emitAuditLog(ctx, {
      actorId: admin.clerkId,
      action: "USER_STATUS_CHANGED",
      entityId: args.userId,
      previousState: previousStatus,
      newState: args.status,
      metadata: {
        targetUserId: args.userId,
        targetUserEmail: user.email,
      },
    });

    return { success: true };
  },
});

