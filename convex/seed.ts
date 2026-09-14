import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { createAccount, modifyAccountCredentials } from "@convex-dev/auth/server";

/**
 * Not exposed to the client. Run once from the CLI to create the single
 * admin account: `npx convex run seed:seedAdmin '{"email":"...","password":"..."}'`
 */
export const seedAdmin = internalAction({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    await createAccount(ctx, {
      provider: "password",
      account: { id: email, secret: password },
      profile: { email },
    });
  },
});

/**
 * Force-resets the password without checking the old one. Not exposed to
 * the client — use when you're locked out or verifying the change-password
 * flow: `npx convex run seed:forceSetPassword '{"email":"...","password":"..."}'`
 */
export const forceSetPassword = internalAction({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    await modifyAccountCredentials(ctx, {
      provider: "password",
      account: { id: email, secret: password },
    });
  },
});
