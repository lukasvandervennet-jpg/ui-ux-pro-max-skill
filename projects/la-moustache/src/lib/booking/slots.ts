import { addDays, fromMinutes, toMinutes, utcToZoned, weekdayOf, zonedToUtc } from "./time";

export type Interval = { start: Date; end: Date };
export type WeekHours = Record<number, { open: string | null; close: string | null }>;

export type SlotRules = {
  timeZone: string;
  slotInterval: number;
  leadMinutes: number;
  maxDaysAhead: number;
  closedDates: readonly string[];
  hours: WeekHours;
};

/** Is deze dag boekbaar (open, niet in het verleden, niet te ver vooruit)? */
export function isBookableDay(dateISO: string, rules: SlotRules, now: Date): boolean {
  const today = utcToZoned(now, rules.timeZone).dateISO;
  if (dateISO < today || dateISO > addDays(today, rules.maxDaysAhead)) return false;
  if (rules.closedDates.includes(dateISO)) return false;
  const day = rules.hours[weekdayOf(dateISO)];
  return Boolean(day?.open && day.close);
}

/** Alle open dagen vanaf vandaag tot het boekingsvenster sluit. */
export function bookableDays(rules: SlotRules, now: Date): string[] {
  const today = utcToZoned(now, rules.timeZone).dateISO;
  const days: string[] = [];
  for (let i = 0; i <= rules.maxDaysAhead; i++) {
    const d = addDays(today, i);
    if (isBookableDay(d, rules, now)) days.push(d);
  }
  return days;
}

const overlaps = (a: Interval, b: Interval) => a.start < b.end && b.start < a.end;

/**
 * Vrije starttijden ("HH:MM") op een dag voor een afspraak van `duration` minuten.
 * Bezette momenten (uit Google Agenda) en de minimale voorlooptijd worden uitgesloten.
 */
export function freeSlots(dateISO: string, duration: number, busy: Interval[], rules: SlotRules, now: Date): string[] {
  if (!isBookableDay(dateISO, rules, now)) return [];
  const day = rules.hours[weekdayOf(dateISO)];
  if (!day?.open || !day.close) return [];

  const earliest = now.getTime() + rules.leadMinutes * 60000;
  const open = toMinutes(day.open);
  const close = toMinutes(day.close);
  const slots: string[] = [];

  for (let m = open; m + duration <= close; m += rules.slotInterval) {
    const time = fromMinutes(m);
    const start = zonedToUtc(dateISO, time, rules.timeZone);
    if (start.getTime() < earliest) continue;
    const slot = { start, end: new Date(start.getTime() + duration * 60000) };
    if (busy.some((b) => overlaps(slot, b))) continue;
    slots.push(time);
  }
  return slots;
}
