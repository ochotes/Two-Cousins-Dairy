import { query } from "./_generated/server";
import { requireUserId } from "./lib";
import { Id } from "./_generated/dataModel";

const HEAT_CYCLE_DAYS = 21;
const GESTATION_DAYS = 283;
const DAY_MS = 24 * 60 * 60 * 1000;
const HORIZON_DAYS = 30;

export const summary = query({
  args: {},
  handler: async (ctx) => {
    await requireUserId(ctx);
    const cows = await ctx.db.query("cows").collect();
    const counts = { total: 0, milking: 0, dry: 0, pregnant: 0, heifer: 0 };
    for (const c of cows) {
      if (c.status === "deregistered") continue;
      counts.total += 1;
      counts[c.status] += 1;
    }
    return counts;
  },
});

type DueItem = {
  id: string;
  kind: "vaccination" | "heat" | "calving";
  cowId: Id<"cows">;
  cowName: string;
  cowTagNumber: string;
  dueDate: number;
  overdue: boolean;
  label: string;
};

export const dueSoon = query({
  args: {},
  handler: async (ctx): Promise<DueItem[]> => {
    await requireUserId(ctx);
    const now = Date.now();
    const horizon = now + HORIZON_DAYS * DAY_MS;

    const cows = await ctx.db.query("cows").collect();
    const cowById = new Map(cows.map((c) => [c._id, c]));
    const activeCows = cows.filter((c) => c.status !== "deregistered");

    const items: DueItem[] = [];

    const vaccinations = await ctx.db.query("vaccinations").collect();
    for (const rec of vaccinations) {
      if (rec.nextDue === undefined || rec.nextDue > horizon) continue;
      const cow = cowById.get(rec.cowId);
      if (!cow || cow.status === "deregistered") continue;
      items.push({
        id: rec._id,
        kind: "vaccination",
        cowId: cow._id,
        cowName: cow.name,
        cowTagNumber: cow.tagNumber,
        dueDate: rec.nextDue,
        overdue: rec.nextDue < now,
        label: `${rec.vaccine} due`,
      });
    }

    const heatEvents = await ctx.db.query("heatEvents").collect();
    const lastHeatByCow = new Map<Id<"cows">, (typeof heatEvents)[number]>();
    for (const h of heatEvents) {
      const existing = lastHeatByCow.get(h.cowId);
      if (!existing || h.date > existing.date) lastHeatByCow.set(h.cowId, h);
    }
    for (const cow of activeCows) {
      if (cow.status === "pregnant" || cow.status === "heifer") continue;
      const last = lastHeatByCow.get(cow._id);
      if (!last) continue;
      const expected = last.date + HEAT_CYCLE_DAYS * DAY_MS;
      if (expected > horizon) continue;
      items.push({
        id: `heat-${cow._id}`,
        kind: "heat",
        cowId: cow._id,
        cowName: cow.name,
        cowTagNumber: cow.tagNumber,
        dueDate: expected,
        overdue: expected < now,
        label: "Heat expected",
      });
    }

    const lastServiceByCow = new Map<Id<"cows">, number>();
    for (const h of heatEvents) {
      if (!h.serviced || h.serviceDate === undefined) continue;
      const existing = lastServiceByCow.get(h.cowId);
      if (existing === undefined || h.serviceDate > existing) {
        lastServiceByCow.set(h.cowId, h.serviceDate);
      }
    }
    for (const cow of activeCows) {
      if (cow.status !== "pregnant") continue;
      const serviceDate = lastServiceByCow.get(cow._id);
      if (serviceDate === undefined) continue;
      const expected = serviceDate + GESTATION_DAYS * DAY_MS;
      if (expected > horizon) continue;
      items.push({
        id: `calving-${cow._id}`,
        kind: "calving",
        cowId: cow._id,
        cowName: cow.name,
        cowTagNumber: cow.tagNumber,
        dueDate: expected,
        overdue: expected < now,
        label: "Calving expected",
      });
    }

    items.sort((a, b) => a.dueDate - b.dueDate);
    return items;
  },
});
