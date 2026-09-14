import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId, logActivity } from "./lib";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireUserId(ctx);
    const records = await ctx.db.query("vaccinations").collect();
    const cows = await ctx.db.query("cows").collect();
    const cowById = new Map(cows.map((c) => [c._id, c]));
    return records
      .map((r) => ({ ...r, cow: cowById.get(r.cowId) ?? null }))
      .sort((a, b) => (a.nextDue ?? Infinity) - (b.nextDue ?? Infinity));
  },
});

export const add = mutation({
  args: {
    cowId: v.id("cows"),
    date: v.number(),
    vaccine: v.string(),
    nextDue: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const cow = await ctx.db.get(args.cowId);
    if (!cow) throw new Error("Cow not found");
    const id = await ctx.db.insert("vaccinations", args);
    await logActivity(ctx, {
      type: "vaccination_added",
      cowId: cow._id,
      cowName: cow.name,
      cowTagNumber: cow.tagNumber,
      message: `Logged ${args.vaccine} vaccination for ${cow.name} (#${cow.tagNumber})`,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("vaccinations"),
    date: v.optional(v.number()),
    vaccine: v.optional(v.string()),
    nextDue: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await requireUserId(ctx);
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("vaccinations") },
  handler: async (ctx, { id }) => {
    await requireUserId(ctx);
    await ctx.db.delete(id);
  },
});
