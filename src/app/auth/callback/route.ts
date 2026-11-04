import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

/** Only send people back to a page on this site. */
function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/en/account";
}

/**
 * Where email links land: sign-in links, account confirmation and password reset.
 * Handles both link styles Supabase can send (?code=… or ?token_hash=…&type=…).
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const next = safeNext(url.searchParams.get("next"));
  const fail = new URL(`${next.split("?")[0]}?auth_error=1`, req.url);
  if (!supabaseConfigured) return NextResponse.redirect(fail);

  const supabase = await supabaseServer();
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
      : { error: new Error("missing code") };

  return NextResponse.redirect(error ? fail : new URL(next, req.url));
}
