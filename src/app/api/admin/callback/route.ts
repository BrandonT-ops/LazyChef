import { NextResponse, type NextRequest } from "next/server";
import { adminConfig } from "@/lib/admin/config";
import { SESSION_COOKIE, STATE_COOKIE, cookieOptions, createSession } from "@/lib/admin/session";

export const runtime = "nodejs";

/** GitHub sends the admin back here. We check who they are and whether they're on the admin list. */
export async function GET(req: NextRequest) {
  const cfg = adminConfig();
  const [expected, locale = "en"] = (req.cookies.get(STATE_COOKIE)?.value ?? "").split(":");
  const back = (q = "") => new URL(`/${locale}/admin${q}`, req.url);
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  if (!cfg.configured || !code || !state || !expected || state !== expected) {
    return NextResponse.redirect(back("?error=signin"));
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        code,
        redirect_uri: `${req.nextUrl.origin}/api/admin/callback`,
      }),
    });
    const { access_token } = (await tokenRes.json()) as { access_token?: string };
    if (!access_token) return NextResponse.redirect(back("?error=signin"));

    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}`, Accept: "application/vnd.github+json" },
    });
    const { login } = (await userRes.json()) as { login?: string };
    // The GitHub token is only used for this check and is not kept.
    if (!login || !cfg.admins.includes(login.toLowerCase())) {
      const res = NextResponse.redirect(back("?error=forbidden"));
      res.cookies.delete(STATE_COOKIE);
      return res;
    }

    const session = createSession(login);
    const res = NextResponse.redirect(back());
    res.cookies.set(SESSION_COOKIE, session.value, cookieOptions(session.maxAge));
    res.cookies.delete(STATE_COOKIE);
    return res;
  } catch {
    return NextResponse.redirect(back("?error=signin"));
  }
}
