import { createSign } from "node:crypto";

import type { Interval } from "./slots";
import type { BookingInput, CalendarClient, StoredBooking } from "./types";

/**
 * Google Agenda via een serviceaccount. Aziz deelt zijn agenda met het
 * e-mailadres van het serviceaccount ("Wijzigingen aanbrengen in afspraken").
 * Elke boeking wordt een gewone afspraak in zijn agenda; de klantgegevens
 * staan ook in verborgen velden, zodat de agenda zelf de databank is.
 */

type Credentials = { clientEmail: string; privateKey: string; calendarId: string; timeZone: string; location: string };

const API = "https://www.googleapis.com/calendar/v3";
const TAG = "lmBooking";

const b64url = (input: string | Buffer) =>
  Buffer.from(input).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

type GoogleEvent = {
  id: string;
  status?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
  extendedProperties?: { private?: Record<string, string> };
};

export class GoogleCalendarClient implements CalendarClient {
  private token: { value: string; expires: number } | null = null;

  constructor(private readonly creds: Credentials) {}

  private async accessToken(): Promise<string> {
    if (this.token && this.token.expires > Date.now() + 60_000) return this.token.value;
    const iat = Math.floor(Date.now() / 1000);
    const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claims = b64url(
      JSON.stringify({
        iss: this.creds.clientEmail,
        scope: "https://www.googleapis.com/auth/calendar",
        aud: "https://oauth2.googleapis.com/token",
        iat,
        exp: iat + 3600,
      }),
    );
    const signature = b64url(createSign("RSA-SHA256").update(`${header}.${claims}`).sign(this.creds.privateKey));
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${header}.${claims}.${signature}`,
      }),
    });
    if (!res.ok) throw new Error(`Google-token geweigerd (${res.status}): ${await res.text()}`);
    const json = (await res.json()) as { access_token: string; expires_in: number };
    this.token = { value: json.access_token, expires: Date.now() + json.expires_in * 1000 };
    return json.access_token;
  }

  private async call<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: { authorization: `Bearer ${await this.accessToken()}`, "content-type": "application/json", ...init.headers },
    });
    if (res.status === 204) return undefined as T;
    if (!res.ok) {
      const err = new Error(`Google Agenda-fout (${res.status}): ${await res.text()}`) as Error & { status: number };
      err.status = res.status;
      throw err;
    }
    return (await res.json()) as T;
  }

  private get cal() {
    return `/calendars/${encodeURIComponent(this.creds.calendarId)}`;
  }

  async busy(from: Date, to: Date): Promise<Interval[]> {
    const json = await this.call<{
      calendars: Record<string, { busy?: { start: string; end: string }[]; errors?: unknown[] }>;
    }>("/freeBusy", {
      method: "POST",
      body: JSON.stringify({
        timeMin: from.toISOString(),
        timeMax: to.toISOString(),
        timeZone: this.creds.timeZone,
        items: [{ id: this.creds.calendarId }],
      }),
    });
    const cal = json.calendars[this.creds.calendarId];
    if (!cal || cal.errors?.length) throw new Error(`Agenda niet bereikbaar: ${JSON.stringify(cal?.errors ?? "onbekend")}`);
    return (cal.busy ?? []).map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));
  }

  async create(b: BookingInput): Promise<StoredBooking> {
    const lines = [
      `Dienst: ${b.serviceName}`,
      `Klant: ${b.name}`,
      `Telefoon: ${b.phone}`,
      `E-mail: ${b.email}`,
      ...(b.note ? [`Opmerking: ${b.note}`] : []),
      "",
      "Geboekt via de website van La Moustache.",
    ];

    const event = await this.call<GoogleEvent>(`${this.cal}/events`, {
      method: "POST",
      body: JSON.stringify({
        summary: `${b.serviceName} · ${b.name}`,
        description: lines.join("\n"),
        location: this.creds.location,
        start: { dateTime: b.start.toISOString(), timeZone: this.creds.timeZone },
        end: { dateTime: b.end.toISOString(), timeZone: this.creds.timeZone },
        extendedProperties: {
          private: {
            [TAG]: "1",
            lmService: b.serviceId,
            lmServiceName: b.serviceName,
            lmName: b.name,
            lmEmail: b.email,
            lmPhone: b.phone,
            lmNote: b.note.slice(0, 900),
            lmReviewOptOut: b.reviewOptOut ? "1" : "0",
            lmFollowUpSent: "0",
          },
        },
      }),
    });
    return { ...b, id: event.id };
  }

  private toBooking(e: GoogleEvent): StoredBooking | null {
    const p = e.extendedProperties?.private;
    if (!p || p[TAG] !== "1" || e.status === "cancelled" || !e.start?.dateTime || !e.end?.dateTime) return null;
    return {
      id: e.id,
      serviceId: p.lmService ?? "",
      serviceName: p.lmServiceName ?? "",
      start: new Date(e.start.dateTime),
      end: new Date(e.end.dateTime),
      name: p.lmName ?? "",
      email: p.lmEmail ?? "",
      phone: p.lmPhone ?? "",
      note: p.lmNote ?? "",
      reviewOptOut: p.lmReviewOptOut === "1",
    };
  }

  async get(id: string): Promise<StoredBooking | null> {
    try {
      return this.toBooking(await this.call<GoogleEvent>(`${this.cal}/events/${encodeURIComponent(id)}`));
    } catch (e) {
      if ((e as { status?: number }).status === 404 || (e as { status?: number }).status === 410) return null;
      throw e;
    }
  }

  async remove(id: string): Promise<void> {
    await this.call(`${this.cal}/events/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  async pendingFollowUps(from: Date, to: Date): Promise<StoredBooking[]> {
    const params = new URLSearchParams({
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "250",
    });
    params.append("privateExtendedProperty", `${TAG}=1`);
    params.append("privateExtendedProperty", "lmFollowUpSent=0");
    const json = await this.call<{ items?: GoogleEvent[] }>(`${this.cal}/events?${params}`);
    return (json.items ?? []).map((e) => this.toBooking(e)).filter((b): b is StoredBooking => b !== null);
  }

  async markFollowUpSent(id: string): Promise<void> {
    await this.call(`${this.cal}/events/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ extendedProperties: { private: { lmFollowUpSent: "1" } } }),
    });
  }
}
