"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const CARDS = [
  { key: "total", label: "Total Herd" },
  { key: "milking", label: "Milking" },
  { key: "dry", label: "Dry" },
  { key: "pregnant", label: "Pregnant" },
  { key: "heifer", label: "Heifers" },
] as const;

export function SummaryCards() {
  const summary = useQuery(api.dashboard.summary);
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {CARDS.map((c) => (
        <Card key={c.key} className="p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-subtle-foreground">
            {c.label}
          </div>
          <div className="mt-2 font-mono text-2xl text-foreground">
            <AnimatedCounter value={summary?.[c.key] ?? 0} />
          </div>
        </Card>
      ))}
    </div>
  );
}
