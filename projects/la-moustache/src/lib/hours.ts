import { openingHours, type OpeningDay } from "@/config/site";

const TIME_ZONE = "Europe/Brussels";

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** "10:00" → "10u", "16:30" → "16u30" — Vlaamse schrijfwijze. */
export const formatTime = (t: string) => {
  const [h, m] = t.split(":");
  return m === "00" ? `${Number(h)}u` : `${Number(h)}u${m}`;
};

export const formatRange = (d: OpeningDay) =>
  d.open && d.close ? `${formatTime(d.open)} – ${formatTime(d.close)}` : "Gesloten";

/** Groepeert opeenvolgende dagen met dezelfde uren: "Di – Vr", "Za". */
export function groupedHours() {
  const groups: { days: string; range: string; closed: boolean }[] = [];
  let i = 0;
  while (i < openingHours.length) {
    const start = openingHours[i];
    let j = i;
    while (
      j + 1 < openingHours.length &&
      openingHours[j + 1].open === start.open &&
      openingHours[j + 1].close === start.close
    )
      j++;
    const end = openingHours[j];
    groups.push({
      days: i === j ? start.label : `${start.label} – ${end.label}`,
      range: formatRange(start),
      closed: !start.open,
    });
    i = j + 1;
  }
  return groups;
}

function nowInBrussels(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day: dayIndex, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type OpenStatus = { open: boolean; label: string; today: number };

/** Live status in Belgische tijd. Enkel client-side aanroepen. */
export function getOpenStatus(date = new Date()): OpenStatus {
  const { day, minutes } = nowInBrussels(date);
  const today = openingHours.find((d) => d.day === day);

  if (today?.open && today.close) {
    const o = toMinutes(today.open);
    const c = toMinutes(today.close);
    if (minutes >= o && minutes < c) return { open: true, label: `Nu open · tot ${formatTime(today.close)}`, today: day };
    if (minutes < o) return { open: false, label: `Vandaag open vanaf ${formatTime(today.open)}`, today: day };
  }

  for (let step = 1; step <= 7; step++) {
    const next = openingHours.find((d) => d.day === (day + step) % 7);
    if (next?.open) {
      const when = step === 1 ? "morgen" : next.label.toLowerCase();
      return { open: false, label: `Gesloten · ${when} vanaf ${formatTime(next.open)}`, today: day };
    }
  }
  return { open: false, label: "Gesloten", today: day };
}
