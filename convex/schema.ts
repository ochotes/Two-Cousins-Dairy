import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export const COW_STATUSES = [
  "milking",
  "dry",
  "pregnant",
  "heifer",
  "deregistered",
] as const;

export const cowStatusValidator = v.union(
  v.literal("milking"),
  v.literal("dry"),
  v.literal("pregnant"),
  v.literal("heifer"),
  v.literal("deregistered"),
);

export default defineSchema({
  ...authTables,

  cows: defineTable({
    tagNumber: v.string(),
    name: v.string(),
    photoId: v.optional(v.id("_storage")),
    dateOfBirth: v.optional(v.number()),
    breed: v.optional(v.string()),
    sireName: v.optional(v.string()),
    damName: v.optional(v.string()),
    status: cowStatusValidator,
    heiferEnteredAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    deregisteredAt: v.optional(v.number()),
    deregisterReason: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_tagNumber", ["tagNumber"]),

  vaccinations: defineTable({
    cowId: v.id("cows"),
    date: v.number(),
    vaccine: v.string(),
    nextDue: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_cow", ["cowId"])
    .index("by_nextDue", ["nextDue"]),

  heatEvents: defineTable({
    cowId: v.id("cows"),
    date: v.number(),
    serviced: v.boolean(),
    serviceDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_cow", ["cowId"])
    .index("by_date", ["date"]),

  calvings: defineTable({
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
  })
    .index("by_cow", ["cowId"])
    .index("by_date", ["date"]),

  activityLog: defineTable({
    type: v.string(),
    cowId: v.optional(v.id("cows")),
    cowName: v.optional(v.string()),
    cowTagNumber: v.optional(v.string()),
    message: v.string(),
  }),
});
