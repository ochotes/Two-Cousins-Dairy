import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

// Single-admin app: there is no public sign-up UI, and this guard also
// rejects a "signUp" flow call made directly against the deployment.
// The one admin account is created out-of-band via `convex/seed.ts`.
const AdminOnlyPassword = Password({
  profile(params) {
    if (params.flow === "signUp") {
      throw new Error("Sign-up is disabled. Contact the administrator.");
    }
    return { email: params.email as string };
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [AdminOnlyPassword],
});
