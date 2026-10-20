import "server-only";

import { BookingError } from "./service";

const STATUS: Record<BookingError["code"], number> = { invalid: 422, unavailable: 409, not_found: 404, past: 410 };

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

/** Zet fouten om naar een nette JSON-respons, zonder interne details te lekken. */
export function errorResponse(e: unknown) {
  if (e instanceof BookingError) return json({ error: e.message, fields: e.fields }, STATUS[e.code]);
  console.error("[afspraken]", e);
  return json({ error: "Er ging iets mis aan onze kant. Probeer het later opnieuw of stuur een WhatsApp." }, 500);
}

/** Eenvoudige rem tegen misbruik: max. `limit` verzoeken per IP per venster (per serverinstantie). */
const hits = new Map<string, number[]>();
export function rateLimited(req: Request, limit = 8, windowMs = 10 * 60 * 1000) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "onbekend";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > limit;
}
