"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { AnimatePresence, motion } from "motion/react";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/dates";

export function ActivityFeed() {
  const activity = useQuery(api.activity.list, { limit: 20 });

  return (
    <Card className="p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground">
        Recent Activity
      </h2>
      {activity === undefined ? (
        <p className="text-sm text-subtle-foreground">Loading…</p>
      ) : activity.length === 0 ? (
        <p className="text-sm text-subtle-foreground">No activity yet.</p>
      ) : (
        <ul>
          <AnimatePresence initial={false}>
            {activity.map((entry) => (
              <motion.li
                key={entry._id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-baseline justify-between gap-4 border-b border-border py-2 text-sm last:border-0"
              >
                <span className="text-muted-foreground">{entry.message}</span>
                <span className="shrink-0 font-mono text-xs text-subtle-foreground">
                  {formatDateTime(entry._creationTime)}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Card>
  );
}
