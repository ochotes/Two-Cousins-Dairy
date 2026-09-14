export const HEAT_CYCLE_DAYS = 21;
export const GESTATION_DAYS = 283;
const DAY_MS = 24 * 60 * 60 * 1000;

export function formatDate(ts: number | undefined | null): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatAge(dob: number | undefined | null): string {
  if (!dob) return "—";
  const diffMs = Date.now() - dob;
  if (diffMs < 0) return "—";
  const totalMonths = Math.floor(diffMs / (30.4375 * DAY_MS));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months}mo`;
  if (months === 0) return `${years}y`;
  return `${years}y ${months}mo`;
}

export function nextExpectedHeat(
  heatEvents: { date: number }[],
): number | null {
  if (heatEvents.length === 0) return null;
  const last = heatEvents.reduce((a, b) => (a.date > b.date ? a : b));
  return last.date + HEAT_CYCLE_DAYS * DAY_MS;
}

export function expectedCalvingDate(
  heatEvents: { serviced: boolean; serviceDate?: number }[],
): number | null {
  const serviced = heatEvents.filter(
    (h): h is { serviced: true; serviceDate: number } =>
      h.serviced && h.serviceDate !== undefined,
  );
  if (serviced.length === 0) return null;
  const last = serviced.reduce((a, b) =>
    a.serviceDate > b.serviceDate ? a : b,
  );
  return last.serviceDate + GESTATION_DAYS * DAY_MS;
}

export function isOverdue(ts: number | null | undefined): boolean {
  return ts !== null && ts !== undefined && ts < Date.now();
}

export function tsToDateInput(ts: number | undefined | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateInputToTs(value: string): number | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function todayDateInput(): string {
  return tsToDateInput(Date.now());
}
