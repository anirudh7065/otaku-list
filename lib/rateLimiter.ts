const RATE_LIMIT = 30;
const WINDOW = 60 * 1000;

const ipStore = new Map<string, { count: number; reset: number }>();

export const rateLimiter = (ip: string)=>{
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now > entry.reset) {
    ipStore.set(ip, { count: 1, reset: now + WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

// Cleanup every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, data] of ipStore.entries()) {
      if (now > data.reset) {
        ipStore.delete(ip);
      }
    }
  },
  5 * 60 * 1000,
);
