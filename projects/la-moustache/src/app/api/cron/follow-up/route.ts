import { errorResponse, json } from "@/lib/booking/http";
import { bookingDeps } from "@/lib/booking/server";
import { runFollowUps } from "@/lib/booking/service";

export const runtime = "nodejs";

/**
 * Dagelijks aangeroepen door Vercel Cron (zie vercel.json). Vercel stuurt
 * automatisch "Authorization: Bearer $CRON_SECRET" mee.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return json({ error: "Niet toegestaan." }, 401);
  }
  const setup = bookingDeps();
  if ("error" in setup) return json({ error: setup.error }, 503);
  try {
    return json(await runFollowUps(setup.deps));
  } catch (e) {
    return errorResponse(e);
  }
}
