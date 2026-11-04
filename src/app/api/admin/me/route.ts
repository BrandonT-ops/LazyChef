import { NextResponse, type NextRequest } from "next/server";
import { adminConfig } from "@/lib/admin/config";
import { readSession } from "@/lib/admin/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Is the admin set up, and who is signed in? (Names missing settings, never their values.) */
export function GET(req: NextRequest) {
  const cfg = adminConfig();
  return NextResponse.json({ configured: cfg.configured, missing: cfg.missing, login: readSession(req) });
}
