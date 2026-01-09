import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const resetUserRole = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();

        if (!user) {
            return { success: false, message: "User not found" };
        }

        await ctx.db.patch(user._id, { role: "user" });
        return { success: true, message: `Role for ${args.email} reset to 'user'` };
    },
});
