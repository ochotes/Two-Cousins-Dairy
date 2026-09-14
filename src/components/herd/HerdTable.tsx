"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { StatusBadge, CowStatus } from "@/components/ui/StatusBadge";
import { FlashRow } from "@/components/ui/FlashCard";
import { formatAge } from "@/lib/dates";
import { inputClass } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

const FILTERS: { value: CowStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "milking", label: "Milking" },
  { value: "dry", label: "Dry" },
  { value: "pregnant", label: "Pregnant" },
  { value: "heifer", label: "Heifer" },
];

export function HerdTable() {
  const cows = useQuery(api.cows.listActive);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CowStatus | "all">("all");

  const filtered = useMemo(() => {
    if (!cows) return [];
    const q = search.trim().toLowerCase();
    return cows.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.tagNumber.toLowerCase().includes(q) ||
        (c.breed ?? "").toLowerCase().includes(q)
      );
    });
  }, [cows, search, statusFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, tag, or breed…"
          className={cn(inputClass, "sm:max-w-xs")}
        />
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                statusFilter === f.value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-subtle-foreground">
              <th className="w-14 px-4 py-2.5 font-medium"></th>
              <th className="px-2 py-2.5 font-medium">Name</th>
              <th className="px-2 py-2.5 font-medium">Tag #</th>
              <th className="px-2 py-2.5 font-medium">Status</th>
              <th className="px-2 py-2.5 font-medium">Breed</th>
              <th className="px-2 py-2.5 font-medium">Age</th>
            </tr>
          </thead>
          <tbody>
            {cows === undefined ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-subtle-foreground"
                >
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-subtle-foreground"
                >
                  No cows match.
                </td>
              </tr>
            ) : (
              filtered.map((cow) => (
                <FlashRow
                  key={`${cow._id}:${cow.updatedAt}`}
                  flashKey={cow.updatedAt}
                  className="border-b border-border last:border-0 hover:bg-muted"
                >
                  <td className="px-4 py-2.5">
                    <Link href={`/herd/${cow._id}`} className="block">
                      <div className="h-8 w-8 overflow-hidden rounded border border-border bg-muted">
                        {cow.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cow.photoUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                    </Link>
                  </td>
                  <td className="px-2 py-2.5">
                    <Link
                      href={`/herd/${cow._id}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {cow.name}
                    </Link>
                  </td>
                  <td className="px-2 py-2.5 font-mono text-xs text-muted-foreground">
                    #{cow.tagNumber}
                  </td>
                  <td className="px-2 py-2.5">
                    <StatusBadge status={cow.status} />
                  </td>
                  <td className="px-2 py-2.5 text-muted-foreground">
                    {cow.breed ?? "—"}
                  </td>
                  <td className="px-2 py-2.5 font-mono text-xs text-muted-foreground">
                    {formatAge(cow.dateOfBirth)}
                  </td>
                </FlashRow>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
