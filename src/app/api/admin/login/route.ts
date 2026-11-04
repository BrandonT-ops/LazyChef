import { NextResponse, type NextRequest } from "next/server";
import { adminConfig } from "@/lib/admin/config";
import { STATE_COOKIE, cookieOptions, randomState } from "@/lib/admin/session";

export const runtime = "nodejs";

/** Sends the admin to GitHub to sign in. Only the public profile is requested (to read the username). */
export function GET(req: NextRequest) {
  const cfg = adminConfig();
  const locale = req.nextUrl.searchParams.get("locale") === "fr" ? "fr" : "en";
  if (!cfg.configured) return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
  const state = randomState();
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", cfg.clientId);
  url.searchParams.set("redirect_uri", `${req.nextUrl.origin}/api/admin/callback`);
  url.searchParams.set("scope", "read:user");
  url.searchParams.set("state", state);
  url.searchParams.set("allow_signup", "false");
  const res = NextResponse.redirect(url);
  res.cookies.set(STATE_COOKIE, `${state}:${locale}`, cookieOptions(600));
  return res;
}
