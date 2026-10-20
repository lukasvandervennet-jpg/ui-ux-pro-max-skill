import nodemailer, { type Transporter } from "nodemailer";

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

/**
 * Verstuurt e-mails via SMTP, bv. een gewoon Gmail-adres met een app-wachtwoord.
 * Handig zolang er nog geen eigen domeinnaam is (Gmail: max. ± 500 mails per dag).
 */
export class SmtpMailer implements Mailer {
  private readonly transport: Transporter;

  constructor(
    options: { host: string; port: number; user: string; pass: string } | { jsonTransport: true },
    private readonly from: string,
  ) {
    this.transport =
      "jsonTransport" in options
        ? nodemailer.createTransport({ jsonTransport: true })
        : nodemailer.createTransport({
            host: options.host,
            port: options.port,
            secure: options.port === 465,
            auth: { user: options.user, pass: options.pass },
          });
  }

  /** Laatst verstuurde mail (enkel ingevuld bij jsonTransport, voor tests). */
  lastMessage: string | null = null;

  async send(m: MailMessage): Promise<void> {
    const info = await this.transport.sendMail({
      from: this.from,
      to: m.to,
      subject: m.subject,
      html: m.html,
      text: m.text,
      replyTo: m.replyTo,
      attachments: m.attachments?.map((a) => ({ filename: a.filename, content: a.content, encoding: "base64", contentType: a.contentType })),
    });
    this.lastMessage = typeof info.message === "string" ? info.message : null;
  }
}

/** Markeert elke mail duidelijk als test (demo-stand met echte e-mails). */
export class TestLabelMailer implements Mailer {
  constructor(private readonly inner: Mailer) {}

  async send(m: MailMessage): Promise<void> {
    const note =
      '<p style="margin:0;padding:12px 16px;background:#fff3cd;color:#5c4400;font:13px Arial,Helvetica,sans-serif">' +
      "<strong>TEST</strong> — dit is een testboeking op de previewsite. Er staat niets in de agenda.</p>";
    await this.inner.send({
      ...m,
      subject: `[TEST] ${m.subject}`,
      html: m.html.replace(/<body([^>]*)>/, `<body$1>${note}`),
      text: `TEST — dit is een testboeking op de previewsite. Er staat niets in de agenda.\n\n${m.text}`,
    });
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
