import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Phase 1: Identity & Users
  users: defineTable({
    clerkId: v.string(), // External identity link
    email: v.string(),
    role: v.union( // RBAC Role Map
      v.literal("admin"),
      v.literal("regulator"),
      v.literal("investor"),
      v.literal("business_owner"),
      v.literal("user")
    ),
    jurisdiction: v.optional(v.string()), // For scoping regulator access
    status: v.union(v.literal("active"), v.literal("suspended")),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_role", ["role"]),

  // Phase 0: Audit Logging
  audit_logs: defineTable({
    actorId: v.string(), // ClerkId or UserId
    action: v.string(),
    entityId: v.optional(v.string()), // The business, deal, or escrow ID
    previousState: v.optional(v.string()),
    newState: v.optional(v.string()),
    metadata: v.any(),
    timestamp: v.number(), // Required for M&E reporting
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_entityId", ["entityId"]),

  // Phase 1: Business Profile
  businesses: defineTable({
    ownerId: v.string(), // ClerkId or UserId
    businessName: v.string(),
    registrationNumber: v.string(), // CAC
    taxId: v.optional(v.string()),
    documents: v.array(v.object({
      type: v.string(),
      url: v.string(),
      status: v.string(), // "pending", "approved", "rejected"
    })),
    verificationStatus: v.string(), // "pending", "verified", "rejected"
    riskScore: v.optional(v.number()),
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_status", ["verificationStatus"]),

  // Phase 1: Investor Profile
  investor_profiles: defineTable({
    userId: v.string(),
    sectors: v.array(v.string()),
    geography: v.array(v.string()),
    capitalRange: v.string(), // e.g. "$1k-$10k"
    riskAppetite: v.string(), // "low", "medium", "high"
  })
    .index("by_userId", ["userId"]),
});

