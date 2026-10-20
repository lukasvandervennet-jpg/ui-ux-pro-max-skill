import { formatLongDate, formatTimeNl, utcToZoned } from "@/lib/booking/time";
import { errorResponse, json, rateLimited } from "@/lib/booking/http";
import { bookingDeps } from "@/lib/booking/server";
import { createBooking, type BookingRequest } from "@/lib/booking/service";

export const runtime = "nodejs";

/** POST /api/booking → afspraak in Google Agenda + bevestigingsmail */
export async function POST(req: Request) {
  const setup = bookingDeps();
  if ("error" in setup) return json({ error: setup.error }, 503);
  if (rateLimited(req)) return json({ error: "Te veel pogingen. Probeer het binnen enkele minuten opnieuw." }, 429);

  let body: BookingRequest;
  try {
    body = (await req.json()) as BookingRequest;
  } catch {
    return json({ error: "Ongeldig verzoek." }, 400);
  }

  try {
    const b = await createBooking(setup.deps, body);
    const tz = setup.deps.rules.timeZone;
    const s = utcToZoned(b.start, tz);
    const e = utcToZoned(b.end, tz);
    return json(
      {
        ok: true,
        booking: {
          service: b.serviceName,
          date: formatLongDate(s.dateISO),
          from: formatTimeNl(s.time),
          to: formatTimeNl(e.time),
          email: b.email,
          start: b.start.toISOString(),
          end: b.end.toISOString(),
        },
      },
      201,
    );
  } catch (e) {
    return errorResponse(e);
  }
}
