import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, sameOrigin } from "@/lib/admin/session";

export const runtime = "nodejs";

export function POST(req: NextRequest) {
  if (!sameOrigin(req)) return new NextResponse(null, { status: 403 });
  const res = new NextResponse(null, { status: 204 });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
