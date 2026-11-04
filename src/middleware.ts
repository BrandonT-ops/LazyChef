import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigured } from "./lib/supabase/env";

const intl = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const res: NextResponse = intl(req);

  // Keep the Supabase session fresh, only for people who are signed in (they have sb-* cookies).
  if (supabaseConfigured && req.cookies.getAll().some((c) => c.name.startsWith("sb-"))) {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list) => list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    });
    await supabase.auth.getUser().catch(() => undefined);
  }
  return res;
}

export const config = {
  // Everything except API routes, the auth callback, Next internals and files with an extension.
  matcher: "/((?!api|auth|_next|_vercel|.*\\..*).*)",
};
