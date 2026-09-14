"use client";

import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useFlashOnMount } from "@/hooks/useFlash";

/**
 * Pass `key={flashKey}` at the call site (in addition to `flashKey`) so
 * React remounts this element — and thus retriggers the flash — whenever
 * the underlying record's updatedAt/creation timestamp changes.
 */
export function FlashCard({
  flashKey,
  className,
  ...props
}: ComponentProps<"div"> & { flashKey: number }) {
  const flashing = useFlashOnMount(flashKey);
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card",
        flashing && "flash-glow",
        className,
      )}
      {...props}
    />
  );
}

export function FlashRow({
  flashKey,
  className,
  ...props
}: ComponentProps<"tr"> & { flashKey: number }) {
  const flashing = useFlashOnMount(flashKey);
  return (
    <tr className={cn(flashing && "flash-glow-row", className)} {...props} />
  );
}
