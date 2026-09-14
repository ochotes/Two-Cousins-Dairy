"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<string, string> = {
  vaccination: "Vaccination",
  heat: "Heat",
  calving: "Calving",
};

export function DueSoonPanel() {
  const items = useQuery(api.dashboard.dueSoon);

  return (
    <Card className="p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground">Due Soon</h2>
      {items === undefined ? (
        <p className="text-sm text-subtle-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-subtle-foreground">
          Nothing due in the next 30 days.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/herd/${item.cowId}`}
                className="flex items-center justify-between gap-4 py-2.5 text-sm transition-colors hover:text-foreground"
              >
                <span className="min-w-0">
                  <span className="text-foreground">{item.cowName}</span>
                  <span className="ml-1.5 font-mono text-xs text-subtle-foreground">
                    #{item.cowTagNumber}
                  </span>
                  <span className="block text-xs text-subtle-foreground">
                    {KIND_LABEL[item.kind]} · {item.label}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 font-mono text-xs",
                    item.overdue ? "text-danger" : "text-muted-foreground",
                  )}
                >
                  {item.overdue ? "Overdue · " : ""}
                  {formatDate(item.dueDate)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
