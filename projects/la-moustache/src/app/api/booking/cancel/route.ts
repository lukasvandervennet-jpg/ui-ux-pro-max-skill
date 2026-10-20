import { errorResponse, json, rateLimited } from "@/lib/booking/http";
import { bookingDeps } from "@/lib/booking/server";
import { cancelBooking, findByToken } from "@/lib/booking/service";
import { formatLongDate, formatTimeNl, utcToZoned } from "@/lib/booking/time";

export const runtime = "nodejs";

function summary(b: { serviceName: string; start: Date }, tz: string) {
  const s = utcToZoned(b.start, tz);
  return { service: b.serviceName, date: formatLongDate(s.dateISO), from: formatTimeNl(s.time), past: b.start <= new Date() };
}

/** GET: toont welke afspraak geannuleerd zou worden (verandert niets — veilig voor mailscanners). */
export async function GET(req: Request) {
  const setup = bookingDeps();
  if ("error" in setup) return json({ error: setup.error }, 503);
  try {
    const b = await findByToken(setup.deps, new URL(req.url).searchParams.get("token"));
    return json({ booking: summary(b, setup.deps.rules.timeZone) });
  } catch (e) {
    return errorResponse(e);
  }
}

/** POST { token } → afspraak verwijderen uit de agenda + bevestiging naar de klant. */
export async function POST(req: Request) {
  const setup = bookingDeps();
  if ("error" in setup) return json({ error: setup.error }, 503);
  if (rateLimited(req)) return json({ error: "Te veel pogingen. Probeer het later opnieuw." }, 429);
  try {
    const { token } = (await req.json()) as { token?: unknown };
    const b = await cancelBooking(setup.deps, token);
    return json({ ok: true, booking: summary(b, setup.deps.rules.timeZone) });
  } catch (e) {
    return errorResponse(e);
  }
}
