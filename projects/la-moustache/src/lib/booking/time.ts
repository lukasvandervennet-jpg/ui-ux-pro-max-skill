/**
 * Tijdzone-hulpjes zonder externe bibliotheek. De server draait in UTC,
 * de zaak in Europe/Brussels (met zomer- en wintertijd).
 */

const pad = (n: number) => String(n).padStart(2, "0");

function offsetMinutes(at: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUtc - at.getTime()) / 60000);
}

/** "2026-10-20" + "10:30" in de tijdzone van de zaak → exact tijdstip. */
export function zonedToUtc(dateISO: string, time: string, timeZone: string): Date {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const first = offsetMinutes(new Date(guess), timeZone);
  let utc = guess - first * 60000;
  const second = offsetMinutes(new Date(utc), timeZone);
  if (second !== first) utc = guess - second * 60000;
  return new Date(utc);
}

/** Exact tijdstip → datum, uur en weekdag zoals in de zaak. */
export function utcToZoned(at: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dateISO = `${get("year")}-${get("month")}-${get("day")}`;
  return { dateISO, time: `${get("hour")}:${get("minute")}`, weekday: weekdayOf(dateISO) };
}

export function weekdayOf(dateISO: string): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

export const isDateISO = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));

export const isTime = (v: unknown): v is string => typeof v === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);

export const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const fromMinutes = (n: number) => `${pad(Math.floor(n / 60))}:${pad(n % 60)}`;

/** "dinsdag 21 oktober 2026" */
export function formatLongDate(dateISO: string) {
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Intl.DateTimeFormat("nl-BE", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** "10:30" → "10u30", "10:00" → "10u" */
export function formatTimeNl(time: string) {
  const [h, m] = time.split(":");
  return m === "00" ? `${Number(h)}u` : `${Number(h)}u${m}`;
}
