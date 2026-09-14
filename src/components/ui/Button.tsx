import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  secondary:
    "border border-border bg-card text-foreground hover:border-border-strong",
  danger:
    "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20",
  ghost: "text-muted-foreground hover:text-foreground",
};

export function Button({
  variant = "secondary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
