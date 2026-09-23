import dns from "node:dns";

const UPSTREAM_UA = process.env.OTAKU_UA ?? "OtakuList/1.0";

const MAX_CONCURRENT = 4;
const RATE_PER_SEC = Math.max(Number(process.env.UPSTREAM_RATE_PER_SEC ?? 3), 1);
const UPSTREAM_TIMEOUT_MS = Math.max(
  Number(process.env.UPSTREAM_TIMEOUT_MS ?? 15000),
  1000,
);
const BURST = MAX_CONCURRENT;

let inFlight = 0;
let tokens = BURST;
let lastRefill = Date.now();
const waiters: (() => void)[] = [];

// undici (Node's fetch) prefers the IPv6 addresses returned by DNS. In
// environments where IPv6 is unroutable (SYN blackholed), every upstream call
// stalls ~10s on a connect timeout before falling back to IPv4 — or dies with
// "fetch failed". Prefer IPv4 for upstream APIs.
let ipv4Patched = false;
type LookupCallback = (
  err: NodeJS.ErrnoException | null,
  address: string | dns.LookupAddress[],
  family: number,
) => void;
function preferIPv4() {
  if (ipv4Patched) return;
  ipv4Patched = true;

  const origLookup = dns.lookup as unknown as (
    hostname: string,
    options: dns.LookupOptions,
    callback: LookupCallback,
  ) => void;

  dns.lookup = ((
    hostname: string,
    options?: dns.LookupOptions | LookupCallback,
    callback?: LookupCallback,
  ) => {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    origLookup(hostname, options ?? {}, (err, address, family) => {
      if (err) return callback?.(err, address, family);
      if (options && (options as dns.LookupAllOptions).all) {
        const addresses = (Array.isArray(address) ? address : []) as dns.LookupAddress[];
        return callback?.(null, addresses.filter((a) => a.family === 4), family);
      }
      callback?.(err, address, family);
    });
  }) as typeof dns.lookup;
}

preferIPv4();

function refill() {
  const now = Date.now();
  const gained = ((now - lastRefill) / 1000) * RATE_PER_SEC;
  tokens = Math.min(BURST, tokens + gained);
  lastRefill = now;
}

function pump() {
  refill();
  while (waiters.length > 0 && inFlight < MAX_CONCURRENT && tokens >= 1) {
    inFlight++;
    tokens -= 1;
    waiters.shift()?.();
  }
}

function release() {
  inFlight--;
  pump();
}

function acquire(): Promise<() => void> {
  refill();
  if (inFlight < MAX_CONCURRENT && tokens >= 1) {
    inFlight++;
    tokens -= 1;
    return Promise.resolve(release);
  }
  return new Promise((resolve) => {
    waiters.push(() => resolve(release));
  });
}

setInterval(pump, 250);

export async function upstreamFetch(
  url: string,
  opts: { revalidate?: number } = {},
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  const release = await acquire();
  try {
    return await fetch(url, {
      headers: {
        UserAgent: UPSTREAM_UA,
        Accept: "application/json",
      },
      signal: controller.signal,
      next: opts.revalidate ? { revalidate: opts.revalidate } : undefined,
    });
  } finally {
    clearTimeout(timer);
    release();
  }
}