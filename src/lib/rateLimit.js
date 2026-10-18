// Small in-memory rate limiter (sliding window).
//
// Note: on Vercel each serverless instance has its own memory, so limits are
// per instance rather than truly global. That's enough to stop someone
// hammering a form from one browser; for strict global limits, swap the Map
// for a shared store such as Upstash Redis.

const buckets = new Map(); // key -> array of hit timestamps (ms)

/**
 * Record a hit for `key` and report whether it's allowed.
 * @param {string} key      e.g. "contact:1.2.3.4"
 * @param {Array<{limit:number, windowMs:number}>} rules  every rule must pass
 * @returns {{ ok: boolean, retryAfter: number }} retryAfter in seconds
 */
export function rateLimit(key, rules) {
  const now = Date.now();
  const longest = Math.max(...rules.map((r) => r.windowMs));
  const hits = (buckets.get(key) || []).filter((t) => now - t < longest);

  for (const { limit, windowMs } of rules) {
    const inWindow = hits.filter((t) => now - t < windowMs);
    if (inWindow.length >= limit) {
      buckets.set(key, hits);
      const retryAfter = Math.ceil((inWindow[0] + windowMs - now) / 1000);
      return { ok: false, retryAfter };
    }
  }

  hits.push(now);
  buckets.set(key, hits);

  // Keep memory bounded on long-lived instances
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (!v.some((t) => now - t < longest)) buckets.delete(k);
    }
  }
  return { ok: true, retryAfter: 0 };
}

export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export function tooManyRequests(retryAfter) {
  return Response.json(
    { error: "Too many requests. Please try again a little later." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}
