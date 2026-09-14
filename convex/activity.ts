import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireUserId } from "./lib";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    await requireUserId(ctx);
    return await ctx.db
      .query("activityLog")
      .order("desc")
      .take(limit ?? 20);
  },
});
