import { errorResponse, json } from "@/lib/booking/http";
import { bookingDeps } from "@/lib/booking/server";
import { getSlots } from "@/lib/booking/service";

export const runtime = "nodejs";

/** GET /api/booking/slots?date=2026-10-21&service=fade → vrije starttijden */
export async function GET(req: Request) {
  const setup = bookingDeps();
  if ("error" in setup) return json({ error: setup.error }, 503);
  const url = new URL(req.url);
  try {
    const slots = await getSlots(setup.deps, url.searchParams.get("date"), url.searchParams.get("service"));
    return json({ slots });
  } catch (e) {
    return errorResponse(e);
  }
}
