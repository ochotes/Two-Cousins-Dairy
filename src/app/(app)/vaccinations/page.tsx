"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { formatDate, isOverdue } from "@/lib/dates";
import { inputClass } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

export default function VaccinationsPage() {
  const records = useQuery(api.vaccinations.listAll);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!records) return [];
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.vaccine.toLowerCase().includes(q) ||
        r.cow?.name.toLowerCase().includes(q) ||
        r.cow?.tagNumber.toLowerCase().includes(q),
    );
  }, [records, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Vaccinations
        </h1>
        <p className="mt-1 text-sm text-subtle-foreground">
          Every vaccination record across the herd, soonest due first.
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by cow or vaccine…"
        className={cn(inputClass, "max-w-xs")}
      />

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-subtle-foreground">
              <th className="px-4 py-2.5 font-medium">Cow</th>
              <th className="px-2 py-2.5 font-medium">Vaccine</th>
              <th className="px-2 py-2.5 font-medium">Given</th>
              <th className="px-2 py-2.5 font-medium">Next Due</th>
            </tr>
          </thead>
          <tbody>
            {records === undefined ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-subtle-foreground"
                >
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-subtle-foreground"
                >
                  No vaccination records.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r._id}
                  className="border-b border-border last:border-0 hover:bg-muted"
                >
                  <td className="px-4 py-2.5">
                    {r.cow ? (
                      <Link
                        href={`/herd/${r.cow._id}`}
                        className="font-medium text-foreground hover:text-accent"
                      >
                        {r.cow.name}{" "}
                        <span className="font-mono text-xs text-subtle-foreground">
                          #{r.cow.tagNumber}
                        </span>
                      </Link>
                    ) : (
                      <span className="text-subtle-foreground">—</span>
                    )}
                  </td>
                  <td className="px-2 py-2.5 text-muted-foreground">
                    {r.vaccine}
                  </td>
                  <td className="px-2 py-2.5 font-mono text-xs text-muted-foreground">
                    {formatDate(r.date)}
                  </td>
                  <td
                    className={cn(
                      "px-2 py-2.5 font-mono text-xs",
                      r.nextDue && isOverdue(r.nextDue)
                        ? "text-danger"
                        : "text-muted-foreground",
                    )}
                  >
                    {r.nextDue ? formatDate(r.nextDue) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
