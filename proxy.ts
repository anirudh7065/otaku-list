import { NextRequest, NextResponse } from "next/server";

function ist() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });
}

export function proxy(req: NextRequest) {
  const requestId = crypto.randomUUID();

  const res = NextResponse.next();
  res.headers.set("x-request-id", requestId);

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
    "/((?!api|_next/static|_next/image|favicon.ico|loading|loading-circle.svg).*)",
  ],
};