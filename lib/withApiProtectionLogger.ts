import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "./rateLimiter";


function ist() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });
}
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return "unknown";
}
export function withApiProtectionLogger(
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return async (req: NextRequest) => {
    const start = Date.now();

    const ip = getClientIp(req);

    const requestId = crypto.randomUUID();

    if (!rateLimiter(ip)) {
      console.warn(
        JSON.stringify({
          timestamp: ist(),
          layer: "rate-limit",
          requestId,
          ip,
          path: req.nextUrl.pathname,
        }),
      );

      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    try {
      const res = await handler(req);

      const cloned = res.clone();
      let body = null;

      try {
        body = await cloned.json();
      } catch {
        body = "non-json-response";
      }
  
let summary: string = "no-preview";

if (body && typeof body === "object") {
  // Case 1: { data: [...] }
  if (Array.isArray(body.data) && body.data.length > 0) {
    summary = body.data[0]?.title ?? summary;
  }

  else {
    const firstKey = Object.keys(body)[0];

    if (
      firstKey &&
      Array.isArray(body[firstKey]) &&
      body[firstKey].length > 0
    ) {
      summary = body[firstKey][0]?.title ?? summary;
    }
  }
}
      console.log({
        layer: "api",
        timestamp: ist(),
        requestId,
        method: req.method,
        path: req.nextUrl.pathname,
        status: res.status,
        duration: `${Date.now() - start}ms`,
        response: summary,
      });

      return res;
    } catch (error) {
      console.error({
          layer: "api",
          timestamp: ist(),
          requestId,
          error: String(error),
        }
      );

      return NextResponse.json(
        { error: (error as Error).message ?? "Internal Server Error" },
        { status: 500 },
      );
    }
  };
}
