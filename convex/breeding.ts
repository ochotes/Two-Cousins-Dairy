import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId, logActivity } from "./lib";

export const heatLog = query({
  args: {},
  handler: async (ctx) => {
    await requireUserId(ctx);
    const events = await ctx.db.query("heatEvents").collect();
    const cows = await ctx.db.query("cows").collect();
    const cowById = new Map(cows.map((c) => [c._id, c]));
    return events
      .map((e) => ({ ...e, cow: cowById.get(e.cowId) ?? null }))
      .sort((a, b) => b.date - a.date);
  },
});

export const calvingHistory = query({
  args: {},
  handler: async (ctx) => {
    await requireUserId(ctx);
    const records = await ctx.db.query("calvings").collect();
    const cows = await ctx.db.query("cows").collect();
    const cowById = new Map(cows.map((c) => [c._id, c]));
    return records
      .map((r) => ({ ...r, cow: cowById.get(r.cowId) ?? null }))
      .sort((a, b) => b.date - a.date);
  },
});

export const addHeat = mutation({
  args: {
    cowId: v.id("cows"),
    date: v.number(),
    serviced: v.boolean(),
    serviceDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const cow = await ctx.db.get(args.cowId);
    if (!cow) throw new Error("Cow not found");
    const id = await ctx.db.insert("heatEvents", args);
    await logActivity(ctx, {
      type: "heat_logged",
      cowId: cow._id,
      cowName: cow.name,
      cowTagNumber: cow.tagNumber,
      message: args.serviced
        ? `Logged heat + service for ${cow.name} (#${cow.tagNumber})`
        : `Logged heat for ${cow.name} (#${cow.tagNumber})`,
    });
    return id;
  },
});

export const updateHeat = mutation({
  args: {
    id: v.id("heatEvents"),
    date: v.optional(v.number()),
    serviced: v.optional(v.boolean()),
    serviceDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await requireUserId(ctx);
    await ctx.db.patch(id, patch);
  },
});

export const removeHeat = mutation({
  args: { id: v.id("heatEvents") },
  handler: async (ctx, { id }) => {
    await requireUserId(ctx);
    await ctx.db.delete(id);
  },
});

export const addCalving = mutation({
  args: {
    cowId: v.id("cows"),
    date: v.number(),
    calfTagNumber: v.optional(v.string()),
    calfSex: v.optional(v.union(v.literal("male"), v.literal("female"))),
    outcome: v.union(
      v.literal("live"),
      v.literal("stillborn"),
      v.literal("aborted"),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const cow = await ctx.db.get(args.cowId);
    if (!cow) throw new Error("Cow not found");
    const id = await ctx.db.insert("calvings", args);
    await logActivity(ctx, {
      type: "calving_logged",
      cowId: cow._id,
      cowName: cow.name,
      cowTagNumber: cow.tagNumber,
      message: `Logged calving for ${cow.name} (#${cow.tagNumber})`,
    });
    return id;
  },
});

export const updateCalving = mutation({
  args: {
    id: v.id("calvings"),
    date: v.optional(v.number()),
    calfTagNumber: v.optional(v.string()),
    calfSex: v.optional(v.union(v.literal("male"), v.literal("female"))),
    outcome: v.optional(
      v.union(v.literal("live"), v.literal("stillborn"), v.literal("aborted")),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await requireUserId(ctx);
    await ctx.db.patch(id, patch);
  },
});

export const removeCalving = mutation({
  args: { id: v.id("calvings") },
  handler: async (ctx, { id }) => {
    await requireUserId(ctx);
    await ctx.db.delete(id);
  },
});
