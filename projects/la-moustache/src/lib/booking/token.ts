import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Ondertekende annuleerlink: bevat het afspraak-ID plus een handtekening,
 * zodat niemand zomaar andermans afspraak kan annuleren.
 */

const b64url = (b: Buffer) => b.toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

const mac = (secret: string, id: string) => b64url(createHmac("sha256", secret).update(`cancel:${id}`).digest()).slice(0, 32);

export function signCancelToken(id: string, secret: string): string {
  return `${b64url(Buffer.from(id))}.${mac(secret, id)}`;
}

export function verifyCancelToken(token: string, secret: string): string | null {
  const [idPart, sig] = token.split(".");
  if (!idPart || !sig) return null;
  let id: string;
  try {
    id = Buffer.from(idPart.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
  } catch {
    return null;
  }
  const expected = Buffer.from(mac(secret, id));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given) ? id : null;
}
