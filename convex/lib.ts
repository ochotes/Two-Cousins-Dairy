import { getAuthUserId } from "@convex-dev/auth/server";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export async function requireUserId(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("Not authenticated");
  }
  return userId;
}

export async function logActivity(
  ctx: MutationCtx,
  args: {
    type: string;
    cowId?: Id<"cows">;
    cowName?: string;
    cowTagNumber?: string;
    message: string;
  },
) {
  await ctx.db.insert("activityLog", args);
}
