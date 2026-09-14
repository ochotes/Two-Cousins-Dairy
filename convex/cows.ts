import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { requireUserId, logActivity } from "./lib";
import { cowStatusValidator } from "./schema";
import { Doc } from "./_generated/dataModel";

async function attachPhotoUrl(ctx: QueryCtx, cow: Doc<"cows">) {
  const photoUrl = cow.photoId ? await ctx.storage.getUrl(cow.photoId) : null;
  return { ...cow, photoUrl };
}

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    await requireUserId(ctx);
    const cows = await ctx.db.query("cows").order("desc").collect();
    const active = cows.filter((c) => c.status !== "deregistered");
    return await Promise.all(active.map((c) => attachPhotoUrl(ctx, c)));
  },
});

export const listArchived = query({
  args: {},
  handler: async (ctx) => {
    await requireUserId(ctx);
    const cows = await ctx.db
      .query("cows")
      .withIndex("by_status", (q) => q.eq("status", "deregistered"))
      .order("desc")
      .collect();
    return await Promise.all(cows.map((c) => attachPhotoUrl(ctx, c)));
  },
});

export const getProfile = query({
  args: { id: v.id("cows") },
  handler: async (ctx, { id }) => {
    await requireUserId(ctx);
    const cow = await ctx.db.get(id);
    if (!cow) return null;
    const [vaccinations, heatEvents, calvings] = await Promise.all([
      ctx.db
        .query("vaccinations")
        .withIndex("by_cow", (q) => q.eq("cowId", id))
        .order("desc")
        .collect(),
      ctx.db
        .query("heatEvents")
        .withIndex("by_cow", (q) => q.eq("cowId", id))
        .order("desc")
        .collect(),
      ctx.db
        .query("calvings")
        .withIndex("by_cow", (q) => q.eq("cowId", id))
        .order("desc")
        .collect(),
    ]);
    const withPhoto = await attachPhotoUrl(ctx, cow);
    return { ...withPhoto, vaccinations, heatEvents, calvings };
  },
});

export const create = mutation({
  args: {
    tagNumber: v.string(),
    name: v.string(),
    photoId: v.optional(v.id("_storage")),
    dateOfBirth: v.optional(v.number()),
    breed: v.optional(v.string()),
    sireName: v.optional(v.string()),
    damName: v.optional(v.string()),
    status: cowStatusValidator,
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const now = Date.now();
    const id = await ctx.db.insert("cows", {
      ...args,
      heiferEnteredAt: args.status === "heifer" ? now : undefined,
      updatedAt: now,
    });
    await logActivity(ctx, {
      type: "cow_created",
      cowId: id,
      cowName: args.name,
      cowTagNumber: args.tagNumber,
      message: `Added ${args.name} (#${args.tagNumber}) to the herd`,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("cows"),
    tagNumber: v.optional(v.string()),
    name: v.optional(v.string()),
    photoId: v.optional(v.id("_storage")),
    dateOfBirth: v.optional(v.number()),
    breed: v.optional(v.string()),
    sireName: v.optional(v.string()),
    damName: v.optional(v.string()),
    status: v.optional(cowStatusValidator),
    heiferEnteredAt: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await requireUserId(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Cow not found");
    const updates: Record<string, unknown> = { ...patch, updatedAt: Date.now() };
    if (patch.status === "heifer" && existing.status !== "heifer" && patch.heiferEnteredAt === undefined) {
      updates.heiferEnteredAt = Date.now();
    }
    await ctx.db.patch(id, updates);
    await logActivity(ctx, {
      type: "cow_updated",
      cowId: id,
      cowName: patch.name ?? existing.name,
      cowTagNumber: patch.tagNumber ?? existing.tagNumber,
      message: `Updated ${patch.name ?? existing.name} (#${patch.tagNumber ?? existing.tagNumber})`,
    });
  },
});

export const deregister = mutation({
  args: { id: v.id("cows"), reason: v.optional(v.string()) },
  handler: async (ctx, { id, reason }) => {
    await requireUserId(ctx);
    const cow = await ctx.db.get(id);
    if (!cow) throw new Error("Cow not found");
    await ctx.db.patch(id, {
      status: "deregistered",
      deregisteredAt: Date.now(),
      deregisterReason: reason,
      updatedAt: Date.now(),
    });
    await logActivity(ctx, {
      type: "cow_deregistered",
      cowId: id,
      cowName: cow.name,
      cowTagNumber: cow.tagNumber,
      message: `Deregistered ${cow.name} (#${cow.tagNumber})`,
    });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUserId(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
