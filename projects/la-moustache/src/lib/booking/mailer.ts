import type { MailMessage, Mailer } from "./types";

/** Verstuurt e-mails via Resend (https://resend.com). Geen extra pakket nodig. */
export class ResendMailer implements Mailer {
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  async send(m: MailMessage): Promise<void> {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${this.apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: this.from,
        to: [m.to],
        subject: m.subject,
        html: m.html,
        text: m.text,
        ...(m.replyTo ? { reply_to: m.replyTo } : {}),
        ...(m.attachments?.length
          ? { attachments: m.attachments.map((a) => ({ filename: a.filename, content: a.content, content_type: a.contentType })) }
          : {}),
      }),
    });
    if (!res.ok) throw new Error(`E-mail niet verstuurd (${res.status}): ${await res.text()}`);
  }
}

/** Demo en tests: e-mails worden enkel bijgehouden en gelogd, niet verstuurd. */
export class MemoryMailer implements Mailer {
  readonly sent: MailMessage[] = [];

  async send(m: MailMessage): Promise<void> {
    this.sent.push(m);
    console.info(`[demo-mail] aan ${m.to}: ${m.subject}\n${m.text}\n[/demo-mail]`);
  }
}

const globalForDemo = globalThis as unknown as { __lmDemoMailer?: MemoryMailer };
export const demoMailer = (globalForDemo.__lmDemoMailer ??= new MemoryMailer());
