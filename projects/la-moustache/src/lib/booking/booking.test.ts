import assert from "node:assert/strict";
import { generateKeyPairSync, createVerify } from "node:crypto";
import { describe, it, mock } from "node:test";

import { MemoryCalendar } from "./demo-calendar";
import { GoogleCalendarClient } from "./google-calendar";
import { buildIcs } from "./ics";
import { MemoryMailer } from "./mailer";
import { BookingError, cancelBooking, createBooking, getSlots, runFollowUps, type BookingDeps } from "./service";
import { freeSlots, bookableDays, type SlotRules } from "./slots";
import { formatLongDate, utcToZoned, zonedToUtc } from "./time";
import { signCancelToken, verifyCancelToken } from "./token";

const TZ = "Europe/Brussels";

const rules: SlotRules = {
  timeZone: TZ,
  slotInterval: 30,
  leadMinutes: 120,
  maxDaysAhead: 42,
  closedDates: ["2026-11-11"],
  hours: {
    0: { open: null, close: null },
    1: { open: null, close: null },
    2: { open: "10:00", close: "19:00" },
    3: { open: "10:00", close: "19:00" },
    4: { open: "10:00", close: "19:00" },
    5: { open: "10:00", close: "19:00" },
    6: { open: "10:00", close: "16:00" },
  },
};

// Maandag 19 oktober 2026, 09:00 in Latem
const NOW = zonedToUtc("2026-10-19", "09:00", TZ);

function makeDeps(calendar = new MemoryCalendar(), mailer = new MemoryMailer()): BookingDeps & { calendar: MemoryCalendar; mailer: MemoryMailer } {
  return {
    calendar,
    mailer,
    rules,
    services: [
      { id: "fade", name: "Fade & skin fade", duration: 30 },
      { id: "haircut-beard", name: "Knippen & baard", duration: 45 },
    ],
    mail: {
      timeZone: TZ,
      siteUrl: "https://example.test",
      businessName: "La Moustache Barbershop",
      address: "Karel Lodewijk Maenhoutstraat 45, 9830 Sint-Martens-Latem",
      phoneDisplay: "+32 499 92 33 42",
      phoneHref: "tel:+32499923342",
      whatsappHref: "https://wa.me/32499923342",
      mapsHref: "https://maps.example",
      instagramHref: "https://instagram.example",
      reviewHref: "https://review.example",
    },
    secret: "test-secret",
    bookUrl: "https://example.test/afspraak-maken",
    cancelUrl: (t) => `https://example.test/afspraak-annuleren?token=${t}`,
  };
}

const validRequest = {
  service: "fade",
  date: "2026-10-20",
  time: "10:30",
  name: "Jan Peeters",
  email: "Jan@Example.be",
  phone: "0470 12 34 56",
  note: "",
  privacy: true,
  reviewOptOut: false,
  website: "",
};

describe("tijdzones", () => {
  it("rekent zomer- en wintertijd correct om", () => {
    assert.equal(zonedToUtc("2026-10-20", "10:00", TZ).toISOString(), "2026-10-20T08:00:00.000Z"); // CEST
    assert.equal(zonedToUtc("2026-11-03", "10:00", TZ).toISOString(), "2026-11-03T09:00:00.000Z"); // CET
    assert.equal(zonedToUtc("2026-03-31", "10:00", TZ).toISOString(), "2026-03-31T08:00:00.000Z"); // na omschakeling
    assert.deepEqual(utcToZoned(new Date("2026-10-20T08:30:00Z"), TZ), { dateISO: "2026-10-20", time: "10:30", weekday: 2 });
  });

  it("schrijft datums voluit in het Nederlands", () => {
    assert.equal(formatLongDate("2026-10-20"), "dinsdag 20 oktober 2026");
  });
});

describe("vrije tijdsloten", () => {
  it("biedt elke 30 minuten aan binnen de openingsuren", () => {
    const slots = freeSlots("2026-10-20", 30, [], rules, NOW);
    assert.equal(slots[0], "10:00");
    assert.equal(slots.at(-1), "18:30");
    assert.equal(slots.length, 18);
  });

  it("houdt rekening met een langere dienst en het sluitingsuur op zaterdag", () => {
    assert.equal(freeSlots("2026-10-24", 45, [], rules, NOW).at(-1), "15:00");
  });

  it("sluit bezette momenten uit de agenda uit", () => {
    const busy = [{ start: zonedToUtc("2026-10-20", "12:00", TZ), end: zonedToUtc("2026-10-20", "13:00", TZ) }];
    const slots = freeSlots("2026-10-20", 30, busy, rules, NOW);
    assert.ok(!slots.includes("12:00") && !slots.includes("12:30"));
    assert.ok(slots.includes("11:30") && slots.includes("13:00"));
    // een afspraak van 45 min om 11:30 zou overlappen met 12:00
    assert.ok(!freeSlots("2026-10-20", 45, busy, rules, NOW).includes("11:30"));
  });

  it("respecteert voorlooptijd, gesloten dagen, extra sluitingsdagen en het boekingsvenster", () => {
    const tuesdayMorning = zonedToUtc("2026-10-20", "11:15", TZ);
    assert.equal(freeSlots("2026-10-20", 30, [], rules, tuesdayMorning)[0], "13:30");
    assert.deepEqual(freeSlots("2026-10-19", 30, [], rules, NOW), []); // maandag dicht
    assert.deepEqual(freeSlots("2026-11-11", 30, [], rules, NOW), []); // extra sluitingsdag
    assert.deepEqual(freeSlots("2026-10-18", 30, [], rules, NOW), []); // verleden
    assert.deepEqual(freeSlots("2026-12-31", 30, [], rules, NOW), []); // te ver vooruit
    const days = bookableDays(rules, NOW);
    assert.equal(days[0], "2026-10-20");
    assert.ok(!days.includes("2026-10-25") && !days.includes("2026-11-11"));
  });
});

describe("annuleerlink", () => {
  it("is ondertekend en niet te vervalsen", () => {
    const t = signCancelToken("abc123", "geheim");
    assert.equal(verifyCancelToken(t, "geheim"), "abc123");
    assert.equal(verifyCancelToken(t, "ander-geheim"), null);
    assert.equal(verifyCancelToken(`${t.split(".")[0]}.xxxxxxxx`, "geheim"), null);
    assert.equal(verifyCancelToken("onzin", "geheim"), null);
  });
});

describe("boeken", () => {
  it("zet de afspraak in de agenda en stuurt een bevestiging met agenda-bestand", async () => {
    const deps = makeDeps();
    const b = await createBooking(deps, validRequest, NOW);
    assert.equal(b.start.toISOString(), "2026-10-20T08:30:00.000Z");
    assert.equal(b.end.toISOString(), "2026-10-20T09:00:00.000Z");
    assert.equal(b.email, "jan@example.be");
    assert.equal(deps.calendar.bookings.size, 1);
    assert.equal(deps.mailer.sent.length, 1);
    const mail = deps.mailer.sent[0];
    assert.equal(mail.to, "jan@example.be");
    assert.match(mail.subject, /dinsdag 20 oktober 2026 om 10u30/);
    assert.match(mail.html, /afspraak-annuleren\?token=/);
    assert.equal(mail.attachments?.[0].contentType, "text/calendar");
    assert.match(Buffer.from(mail.attachments![0].content, "base64").toString(), /DTSTART:20261020T083000Z/);
  });

  it("weigert een tijdstip dat net bezet werd (geen dubbele boekingen)", async () => {
    const deps = makeDeps();
    await createBooking(deps, validRequest, NOW);
    await assert.rejects(createBooking(deps, { ...validRequest, email: "ander@example.be" }, NOW), (e: unknown) => {
      return e instanceof BookingError && e.code === "unavailable";
    });
    assert.ok(!(await getSlots(deps, "2026-10-20", "fade", NOW)).includes("10:30"));
  });

  it("valideert elk veld en vraagt akkoord met de privacyverklaring", async () => {
    const deps = makeDeps();
    await assert.rejects(
      createBooking(deps, { ...validRequest, name: "J", email: "geen-mail", phone: "12", privacy: false }, NOW),
      (e: unknown) =>
        e instanceof BookingError &&
        e.code === "invalid" &&
        ["name", "email", "phone", "privacy"].every((f) => f in (e.fields ?? {})),
    );
    assert.equal(deps.calendar.bookings.size, 0);
  });

  it("negeert bots die het verborgen veld invullen", async () => {
    const deps = makeDeps();
    await assert.rejects(createBooking(deps, { ...validRequest, website: "spam.example" }, NOW));
    assert.equal(deps.calendar.bookings.size, 0);
  });

  it("verwittigt Aziz als BOOKING_NOTIFY_EMAIL ingesteld is", async () => {
    const deps = { ...makeDeps(), notifyEmail: "aziz@example.be" };
    await createBooking(deps, validRequest, NOW);
    assert.deepEqual(
      deps.mailer.sent.map((m) => m.to),
      ["jan@example.be", "aziz@example.be"],
    );
  });
});

describe("annuleren", () => {
  it("verwijdert de afspraak en bevestigt dat aan de klant", async () => {
    const deps = makeDeps();
    const b = await createBooking(deps, validRequest, NOW);
    await cancelBooking(deps, signCancelToken(b.id, deps.secret), NOW);
    assert.equal(deps.calendar.bookings.size, 0);
    assert.match(deps.mailer.sent.at(-1)!.subject, /^Geannuleerd/);
  });

  it("kan een voorbije afspraak niet meer annuleren", async () => {
    const deps = makeDeps();
    const b = await createBooking(deps, validRequest, NOW);
    const later = zonedToUtc("2026-10-20", "11:00", TZ);
    await assert.rejects(cancelBooking(deps, signCancelToken(b.id, deps.secret), later), (e: unknown) => {
      return e instanceof BookingError && e.code === "past";
    });
  });
});

describe("bedankmail na de afspraak", () => {
  it("stuurt één keer een reviewvraag na afloop, en respecteert wie dat niet wil", async () => {
    const deps = makeDeps();
    await createBooking(deps, validRequest, NOW);
    await createBooking(deps, { ...validRequest, time: "11:00", email: "geen@example.be", reviewOptOut: true }, NOW);
    await createBooking(deps, { ...validRequest, time: "18:00", email: "later@example.be" }, NOW);
    deps.mailer.sent.length = 0;

    const evening = zonedToUtc("2026-10-20", "17:00", TZ);
    const first = await runFollowUps(deps, evening);
    assert.deepEqual(first, { checked: 2, sent: 1 }); // de afspraak van 18u is nog niet begonnen
    assert.equal(deps.mailer.sent[0].to, "jan@example.be");
    assert.match(deps.mailer.sent[0].html, /https:\/\/review\.example/);

    // De volgende avond: enkel de afspraak van 18u is nog niet behandeld.
    const next = await runFollowUps(deps, zonedToUtc("2026-10-21", "21:15", TZ));
    assert.deepEqual(next, { checked: 1, sent: 1 });
    assert.equal(deps.mailer.sent.at(-1)!.to, "later@example.be");

    // Nooit twee keer.
    assert.deepEqual(await runFollowUps(deps, zonedToUtc("2026-10-21", "22:00", TZ)), { checked: 0, sent: 0 });
  });
});

describe("agenda-bestand", () => {
  it("is geldig opgebouwd en ontsnapt speciale tekens", () => {
    const ics = buildIcs({
      uid: "x1",
      start: new Date("2026-10-20T08:30:00Z"),
      end: new Date("2026-10-20T09:00:00Z"),
      summary: "Fade, bij La Moustache",
      location: "Straat 45; Latem",
      description: "Lijn 1\nLijn 2",
      now: new Date("2026-10-19T07:00:00Z"),
    });
    assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
    assert.match(ics, /SUMMARY:Fade\\, bij La Moustache/);
    assert.match(ics, /LOCATION:Straat 45\\; Latem/);
    assert.match(ics, /DESCRIPTION:Lijn 1\\nLijn 2/);
    assert.ok(ics.split("\r\n").every((l) => l.length <= 75));
  });
});

describe("Google Agenda-koppeling (nagebootste Google-server)", () => {
  it("meldt zich correct aan, leest bezette momenten en maakt een afspraak met klantgegevens", async () => {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const calls: { url: string; init?: RequestInit }[] = [];
    const fetchMock = mock.method(globalThis, "fetch", async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      calls.push({ url, init });
      if (url.startsWith("https://oauth2.googleapis.com/token")) {
        return Response.json({ access_token: "tok", expires_in: 3600 });
      }
      if (url.endsWith("/freeBusy")) {
        return Response.json({
          calendars: { "aziz@example.com": { busy: [{ start: "2026-10-20T10:00:00Z", end: "2026-10-20T11:00:00Z" }] } },
        });
      }
      if (url.includes("/events") && init?.method === "POST") return Response.json({ id: "evt1" });
      return new Response("niet verwacht", { status: 500 });
    });

    try {
      const client = new GoogleCalendarClient({
        clientEmail: "boekingen@project.iam.gserviceaccount.com",
        privateKey: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
        calendarId: "aziz@example.com",
        timeZone: TZ,
        location: "Maenhoutstraat 45",
      });
      const busy = await client.busy(new Date("2026-10-20T00:00:00Z"), new Date("2026-10-21T00:00:00Z"));
      assert.equal(busy.length, 1);

      // De aanmelding is een geldig door het serviceaccount ondertekend JWT.
      const assertion = new URLSearchParams(String(calls[0].init?.body)).get("assertion")!;
      const [h, c, sig] = assertion.split(".");
      const ok = createVerify("RSA-SHA256")
        .update(`${h}.${c}`)
        .verify(publicKey, Buffer.from(sig.replace(/-/g, "+").replace(/_/g, "/"), "base64"));
      assert.ok(ok, "handtekening klopt");
      assert.equal(JSON.parse(Buffer.from(c, "base64").toString()).iss, "boekingen@project.iam.gserviceaccount.com");

      const created = await client.create({
        serviceId: "fade",
        serviceName: "Fade & skin fade",
        start: new Date("2026-10-20T08:30:00Z"),
        end: new Date("2026-10-20T09:00:00Z"),
        name: "Jan Peeters",
        email: "jan@example.be",
        phone: "0470 12 34 56",
        note: "",
        reviewOptOut: false,
      });
      assert.equal(created.id, "evt1");
      const eventCall = calls.find((x) => x.url.includes("/events"))!;
      assert.match(eventCall.url, /calendars\/aziz%40example\.com\/events$/);
      const body = JSON.parse(String(eventCall.init?.body));
      assert.equal(body.summary, "Fade & skin fade · Jan Peeters");
      assert.equal(body.extendedProperties.private.lmEmail, "jan@example.be");
      assert.equal(body.extendedProperties.private.lmFollowUpSent, "0");
      assert.match(body.description, /Telefoon: 0470 12 34 56/);
      // Het token wordt hergebruikt: maar één aanmelding voor beide aanroepen.
      assert.equal(calls.filter((x) => x.url.includes("oauth2")).length, 1);
    } finally {
      fetchMock.mock.restore();
    }
  });
});
