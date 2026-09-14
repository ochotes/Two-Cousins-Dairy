import { ReactNode } from "react";

export const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-subtle-foreground">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs text-subtle-foreground">
          {hint}
        </span>
      )}
    </label>
  );
}
