// Database-backed abuse protection, shared by every server instance.
// Complements the fast in-memory limiter in rateLimit.js.

import { createHash } from "crypto";
import Submission from "@/models/Submission";
import { MINUTE, DAY } from "@/lib/rateLimit";

const SALT = process.env.IP_HASH_SALT || "aftab-portfolio";

/** We never store raw IPs — only a salted hash, enough to count repeats. */
export const hashIp = (ip) => createHash("sha256").update(SALT + ip).digest("hex").slice(0, 32);

const fingerprintOf = (text) =>
  createHash("sha256").update(text.toLowerCase().replace(/\s+/g, " ").trim()).digest("hex").slice(0, 32);

// Limits per kind of write
const LIMITS = {
  contact: { perIp: [[3, 10 * MINUTE], [10, DAY]], global: 60 },
  comment: { perIp: [[5, 10 * MINUTE], [20, DAY]], global: 200 },
  reply: { perIp: [[5, 10 * MINUTE], [20, DAY]], global: 200 },
};

/**
 * Check whether a write is allowed, and record it if so.
 * @returns {{ ok: true } | { ok: false, status: number, error: string, retryAfter?: number }}
 */
export async function guardWrite(kind, ip, content) {
  const rules = LIMITS[kind];
  const ipHash = hashIp(ip);
  const fingerprint = fingerprintOf(content);
  const now = Date.now();

  for (const [limit, windowMs] of rules.perIp) {
    const count = await Submission.countDocuments({
      kind,
      ipHash,
      createdAt: { $gte: new Date(now - windowMs) },
    });
    if (count >= limit) {
      return {
        ok: false,
        status: 429,
        error: "Too many requests. Please try again a little later.",
        retryAfter: Math.ceil(windowMs / 1000),
      };
    }
  }

  // The same text sent again within a day is a repeat, not a new message
  if (await Submission.exists({ kind, fingerprint })) {
    return { ok: false, status: 409, error: "Looks like you've already sent this one." };
  }

  const today = await Submission.countDocuments({ kind, createdAt: { $gte: new Date(now - DAY) } });
  if (today >= rules.global) {
    return { ok: false, status: 429, error: "We're receiving a lot right now. Please try again tomorrow.", retryAfter: 3600 };
  }

  await Submission.create({ kind, ipHash, fingerprint });
  return { ok: true, ipHash };
}

/** Refuse new rows once a collection reaches a size nobody legitimately needs. */
export async function underCapacity(Model, max) {
  return (await Model.estimatedDocumentCount()) < max;
}
