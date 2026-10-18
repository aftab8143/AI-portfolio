import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import ContactMessage from "@/models/ContactMessage";
import { notify, isEmail, clean } from "@/lib/notify";
import { rateLimit, clientIp, tooManyRequests, MINUTE, DAY } from "@/lib/rateLimit";
import { guardWrite, underCapacity } from "@/lib/guard";

// Forms submitted faster than this are almost certainly bots
const MIN_FILL_MS = 3000;
// Far more messages than a portfolio will ever legitimately receive
const MAX_STORED_MESSAGES = 20000;

export async function POST(req) {
  const ip = clientIp(req);

  // Fast first line: per-instance memory limit (3 per 10 min, 10 per day)
  const perIp = rateLimit(`contact:${ip}`, [
    { limit: 3, windowMs: 10 * MINUTE },
    { limit: 10, windowMs: DAY },
  ]);
  if (!perIp.ok) return tooManyRequests(perIp.retryAfter);

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Bots: hidden honeypot filled in, or form submitted impossibly fast.
  // Pretend it worked so they don't adapt — nothing is stored or sent.
  const filledTooFast = Number(body.startedAt) && Date.now() - Number(body.startedAt) < MIN_FILL_MS;
  if (clean(body.website, 200) || filledTooFast) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 80);
  const email = clean(body.email, 254);
  const type = clean(body.type, 60);
  const message = clean(body.message, 5000);

  if (!name || !isEmail(email) || message.length < 10) {
    return NextResponse.json(
      { error: "Please add your name, a valid email and a message of at least 10 characters." },
      { status: 400 }
    );
  }

  // Database: shared rate limits + keep a copy of every message.
  // If the database is unreachable, still email — a lead is never lost.
  let saved = null;
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      const guard = await guardWrite("contact", ip, email + message);
      if (!guard.ok) {
        return NextResponse.json(
          { error: guard.error },
          { status: guard.status, headers: guard.retryAfter ? { "Retry-After": String(guard.retryAfter) } : {} }
        );
      }
      if (await underCapacity(ContactMessage, MAX_STORED_MESSAGES)) {
        saved = await ContactMessage.create({
          name,
          email,
          type,
          message,
          ipHash: guard.ipHash,
          userAgent: clean(req.headers.get("user-agent"), 300),
        });
      } else {
        console.error("Contact messages at capacity — not storing new ones");
      }
    } catch (err) {
      console.error("Contact DB step failed (continuing to email):", err);
    }
  }

  // Whole site, per instance: protect the email quota
  const global = rateLimit("contact:all", [{ limit: 60, windowMs: DAY }]);
  if (!global.ok) return tooManyRequests(global.retryAfter);

  try {
    await notify({
      subject: `New message from ${name}${type ? ` — ${type}` : ""}`,
      title: "New portfolio enquiry",
      rows: [
        ["Name", name],
        ["Email", email],
        ["About", type],
      ],
      body: message,
      replyTo: email,
    });
    if (saved) await ContactMessage.updateOne({ _id: saved._id }, { emailed: true }).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact email failed:", err);
    if (saved) {
      await ContactMessage.updateOne({ _id: saved._id }, { emailError: String(err.message).slice(0, 300) }).catch(() => {});
      // It's safely stored, so the visitor doesn't need to resend
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "Couldn't send right now. Please email me directly at aftab8143@gmail.com." },
      { status: 502 }
    );
  }
}
