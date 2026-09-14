import { cn } from "@/lib/utils";

export type CowStatus =
  | "milking"
  | "dry"
  | "pregnant"
  | "heifer"
  | "deregistered";

export const STATUS_LABELS: Record<CowStatus, string> = {
  milking: "Milking",
  dry: "Dry",
  pregnant: "Pregnant",
  heifer: "Heifer",
  deregistered: "Deregistered",
};

export function StatusBadge({
  status,
  className,
}: {
  status: CowStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border border-border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
        status === "deregistered" && "opacity-60",
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
