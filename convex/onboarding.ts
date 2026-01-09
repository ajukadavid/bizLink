import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createBusinessProfile = mutation({
    args: {
        businessName: v.string(),
        registrationNumber: v.string(),
        taxId: v.optional(v.string()),
        // We'll handle documents separately or as a list of URLs after upload
        documents: v.array(v.object({
            type: v.string(),
            url: v.string(),
            status: v.string()
        })),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createBusinessProfile without authentication present");
        }

        // 1. Create Business
        const businessId = await ctx.db.insert("businesses", {
            ownerId: identity.subject, // Using Clerk ID (subject) as ownerId
            businessName: args.businessName,
            registrationNumber: args.registrationNumber,
            taxId: args.taxId,
            documents: args.documents,
            verificationStatus: "pending",
            riskScore: undefined, // Initial score
        });

        // 2. Update User Role
        // specific user lookup by clerkId might be needed if we don't have the internal ID
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (user) {
            await ctx.db.patch(user._id, { role: "business_owner" }); // OR "user" + business association? Schema said role is union.
        }

        return businessId;
    },
});

export const createInvestorProfile = mutation({
    args: {
        sectors: v.array(v.string()),
        capitalRange: v.string(),
        riskAppetite: v.string(),
        // geography is missing in args but in schema? Adding it.
        // Wait, let's check schema. yes, geography is array string.
        geography: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createInvestorProfile without authentication present");
        }

        // 1. Create Investor Profile
        const profileId = await ctx.db.insert("investor_profiles", {
            userId: identity.subject,
            sectors: args.sectors,
            geography: args.geography || [], // Default to empty if not provided
            capitalRange: args.capitalRange,
            riskAppetite: args.riskAppetite,
        });

        // 2. Update User Role
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (user) {
            await ctx.db.patch(user._id, { role: "investor" });
        }

        return profileId;
    },
});
