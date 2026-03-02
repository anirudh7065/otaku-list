export function clientLog(
  level: "info" | "error",
  message: string,
  meta?: Record<string, unknown>
) {
  fetch("/api/log", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      timestamp: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      }),
      level,
      message,
      meta,
      url: window.location.pathname,
      ua: navigator.userAgent,
    }),
  });
}
