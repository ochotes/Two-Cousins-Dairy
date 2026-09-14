"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { formatDate } from "@/lib/dates";

export default function ArchivePage() {
  const cows = useQuery(api.cows.listArchived);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Archive</h1>
        <p className="mt-1 text-sm text-subtle-foreground">
          Deregistered animals. Records are kept, not deleted.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-subtle-foreground">
              <th className="w-14 px-4 py-2.5 font-medium"></th>
              <th className="px-2 py-2.5 font-medium">Name</th>
              <th className="px-2 py-2.5 font-medium">Tag #</th>
              <th className="px-2 py-2.5 font-medium">Deregistered</th>
              <th className="px-2 py-2.5 font-medium">Reason</th>
            </tr>
          </thead>
          <tbody>
            {cows === undefined ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-subtle-foreground"
                >
                  Loading…
                </td>
              </tr>
            ) : cows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-subtle-foreground"
                >
                  No deregistered animals.
                </td>
              </tr>
            ) : (
              cows.map((cow) => (
                <tr
                  key={cow._id}
                  className="border-b border-border last:border-0 hover:bg-muted"
                >
                  <td className="px-4 py-2.5">
                    <Link href={`/herd/${cow._id}`} className="block">
                      <div className="h-8 w-8 overflow-hidden rounded border border-border bg-muted opacity-70">
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
                  <td className="px-2 py-2.5 font-mono text-xs text-muted-foreground">
                    {formatDate(cow.deregisteredAt)}
                  </td>
                  <td className="px-2 py-2.5 text-muted-foreground">
                    {cow.deregisterReason ?? "—"}
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
