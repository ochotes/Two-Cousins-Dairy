"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    formData.set("flow", "signIn");
    try {
      await signIn("password", formData);
      router.push("/");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded border border-border bg-card text-accent">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 10c0-2.5 1.5-4 3.5-4 1 0 1.7.4 2.5 1.2.8-.8 1.5-1.2 2.5-1.2s1.7.4 2.5 1.2c.8-.8 1.5-1.2 2.5-1.2 2 0 3.5 1.5 3.5 4 0 4-3 8-8.5 10.5C7 18 4 14 4 10Z"
              />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-foreground">
            Two Cousins Dairy
          </h1>
          <p className="mt-1 text-sm text-subtle-foreground">
            Herd management — sign in to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-border bg-card p-6"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-subtle-foreground"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                autoFocus
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-subtle-foreground"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
