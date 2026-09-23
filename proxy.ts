import { NextRequest, NextResponse } from "next/server";

const INTERNAL_KEY = process.env.INTERNAL_KEY ?? "";

function ist() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });
}

function isSameOrigin(req: NextRequest): boolean {
  const host = req.headers.get("host") ?? "";
  const origin = req.headers.get("origin") ?? "";

  const secFetchSite = req.headers.get("sec-fetch-site");
  if (secFetchSite) {
    return ["same-origin", "same-site"].includes(secFetchSite);
  }

  if (origin) {
    return origin === `https://${host}` || origin === `http://${host}`;
  }

  return false;
}

export function proxy(req: NextRequest) {
  const requestId = crypto.randomUUID();

  const res = NextResponse.next();
  res.headers.set("x-request-id", requestId);

  if (req.nextUrl.pathname.startsWith("/api")) {
    if (INTERNAL_KEY) {
      if (req.headers.get("x-internal-key") === INTERNAL_KEY) {
        return res;
      }

      if (!isSameOrigin(req)) {
        console.log({
          layer: "middleware",
          timestamp: ist(),
          requestId,
          method: req.method,
          path: req.nextUrl.pathname,
          status: 403,
          ip: req.headers.get("x-forwarded-for") ?? "unknown",
          ua: req.headers.get("user-agent"),
          blocked: "api",
        });
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return res;
  }

  console.log({
    layer: "middleware",
    timestamp: ist(),
    requestId,
    method: req.method,
    path: req.nextUrl.pathname,
    ip: req.headers.get("x-forwarded-for") ?? "unknown",
    ua: req.headers.get("user-agent"),
  });

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|loading|loading-circle.svg).*)",
  ],
};