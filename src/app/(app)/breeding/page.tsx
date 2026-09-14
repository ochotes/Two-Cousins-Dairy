"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/dates";

export default function BreedingPage() {
  const heatLog = useQuery(api.breeding.heatLog);
  const calvingHistory = useQuery(api.breeding.calvingHistory);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Breeding</h1>
        <p className="mt-1 text-sm text-subtle-foreground">
          Heat log and calving history across the herd.
        </p>
      </div>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Heat / Estrus Log
        </h2>
        {heatLog === undefined ? (
          <p className="text-sm text-subtle-foreground">Loading…</p>
        ) : heatLog.length === 0 ? (
          <p className="text-sm text-subtle-foreground">
            No heat events logged.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {heatLog.map((h) => (
              <li
                key={h._id}
                className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm"
              >
                <div>
                  {h.cow ? (
                    <Link
                      href={`/herd/${h.cow._id}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {h.cow.name}{" "}
                      <span className="font-mono text-xs text-subtle-foreground">
                        #{h.cow.tagNumber}
                      </span>
                    </Link>
                  ) : (
                    <span className="text-subtle-foreground">—</span>
                  )}
                  {h.serviced && (
                    <span className="ml-2 text-subtle-foreground">
                      Serviced
                      {h.serviceDate ? ` on ${formatDate(h.serviceDate)}` : ""}
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDate(h.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Calving History
        </h2>
        {calvingHistory === undefined ? (
          <p className="text-sm text-subtle-foreground">Loading…</p>
        ) : calvingHistory.length === 0 ? (
          <p className="text-sm text-subtle-foreground">
            No calving records.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {calvingHistory.map((c) => (
              <li
                key={c._id}
                className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm"
              >
                <div>
                  {c.cow ? (
                    <Link
                      href={`/herd/${c.cow._id}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {c.cow.name}{" "}
                      <span className="font-mono text-xs text-subtle-foreground">
                        #{c.cow.tagNumber}
                      </span>
                    </Link>
                  ) : (
                    <span className="text-subtle-foreground">—</span>
                  )}
                  <span className="ml-2 capitalize text-subtle-foreground">
                    {c.outcome}
                  </span>
                  {c.calfTagNumber && (
                    <span className="ml-2 font-mono text-xs text-subtle-foreground">
                      Calf #{c.calfTagNumber}
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDate(c.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
