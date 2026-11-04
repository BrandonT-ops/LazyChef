import "server-only";
import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { adminConfig } from "./config";

export const SESSION_COOKIE = "chop_admin";
export const STATE_COOKIE = "chop_oauth_state";
const WEEK = 7 * 24 * 60 * 60;

const b64url = (b: Buffer) => b.toString("base64url");

function hmac(data: string, secret: string) {
  return b64url(crypto.createHmac("sha256", secret).update(data).digest());
}

/** "payload.signature": the payload says who is signed in and until when; the signature stops tampering. */
export function createSession(login: string): { value: string; maxAge: number } {
  const { secret } = adminConfig();
  const payload = b64url(Buffer.from(JSON.stringify({ login, exp: Math.floor(Date.now() / 1000) + WEEK })));
  return { value: `${payload}.${hmac(payload, secret)}`, maxAge: WEEK };
}

/** The signed-in admin's GitHub login, or null. Re-checks the allowlist on every request. */
export function readSession(req: NextRequest): string | null {
  const cfg = adminConfig();
  if (!cfg.configured) return null;
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expected = hmac(payload, cfg.secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const { login, exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { login: string; exp: number };
    if (!login || exp < Date.now() / 1000) return null;
    return cfg.admins.includes(login.toLowerCase()) ? login : null;
  } catch {
    return null;
  }
}

export function randomState() {
  return b64url(crypto.randomBytes(24));
}

/** Blocks cross-site form posts: writes must come from this same site. */
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  return !origin || origin === req.nextUrl.origin;
}

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});
