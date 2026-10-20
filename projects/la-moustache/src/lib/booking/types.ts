import type { Interval } from "./slots";

export type BookingInput = {
  serviceId: string;
  serviceName: string;
  start: Date;
  end: Date;
  name: string;
  email: string;
  phone: string;
  note: string;
  reviewOptOut: boolean;
};

export type StoredBooking = BookingInput & { id: string };

/** Alles wat het boekingssysteem van een agenda nodig heeft. */
export interface CalendarClient {
  busy(from: Date, to: Date): Promise<Interval[]>;
  create(booking: BookingInput): Promise<StoredBooking>;
  get(id: string): Promise<StoredBooking | null>;
  remove(id: string): Promise<void>;
  /** Website-afspraken die in [from, to] begonnen en nog geen bedankmail kregen. */
  pendingFollowUps(from: Date, to: Date): Promise<StoredBooking[]>;
  markFollowUpSent(id: string): Promise<void>;
}

export type MailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: string; contentType: string }[]; // content = base64
};

export interface Mailer {
  send(message: MailMessage): Promise<void>;
}
