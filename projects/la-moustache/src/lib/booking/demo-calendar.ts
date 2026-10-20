import { randomUUID } from "node:crypto";

import type { Interval } from "./slots";
import type { BookingInput, CalendarClient, StoredBooking } from "./types";

/**
 * Agenda in het geheugen, voor de demo-modus en tests. Er wordt niets naar
 * Google gestuurd; alles verdwijnt bij een herstart van de server.
 */
export class MemoryCalendar implements CalendarClient {
  readonly bookings = new Map<string, StoredBooking & { followUpSent: boolean }>();

  constructor(private readonly extraBusy: Interval[] = []) {}

  async busy(from: Date, to: Date): Promise<Interval[]> {
    const own = [...this.bookings.values()].map((b) => ({ start: b.start, end: b.end }));
    return [...own, ...this.extraBusy].filter((i) => i.start < to && i.end > from);
  }

  async create(b: BookingInput): Promise<StoredBooking> {
    const stored = { ...b, id: randomUUID().replace(/-/g, "") };
    this.bookings.set(stored.id, { ...stored, followUpSent: false });
    return stored;
  }

  async get(id: string) {
    const b = this.bookings.get(id);
    if (!b) return null;
    const { followUpSent: _sent, ...rest } = b;
    return rest;
  }

  async remove(id: string) {
    this.bookings.delete(id);
  }

  async pendingFollowUps(from: Date, to: Date) {
    return [...this.bookings.values()]
      .filter((b) => !b.followUpSent && b.start >= from && b.start <= to)
      .map(({ followUpSent: _sent, ...rest }) => rest);
  }

  async markFollowUpSent(id: string) {
    const b = this.bookings.get(id);
    if (b) b.followUpSent = true;
  }
}

/** Eén gedeelde demo-agenda per serverproces. */
const globalForDemo = globalThis as unknown as { __lmDemoCalendar?: MemoryCalendar };
export const demoCalendar = (globalForDemo.__lmDemoCalendar ??= new MemoryCalendar());
