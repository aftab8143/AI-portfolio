// Email notifications through Resend's REST API (no SDK needed).
//
// Env:
//   RESEND_API_KEY      required
//   NOTIFY_EMAIL        where notifications go (default: the portfolio inbox)
//   NOTIFY_FROM_EMAIL   sender; until you verify your own domain in Resend,
//                       keep the default onboarding sender, which can only
//                       deliver to the email your Resend account uses.

const TO = process.env.NOTIFY_EMAIL || "aftab8143@gmail.com";
const FROM = process.env.NOTIFY_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

export const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Render label/value rows as a simple, readable email. */
function layout(title, rows, body) {
  const rowHtml = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6b6b74;white-space:nowrap;vertical-align:top">${escapeHtml(
          k
        )}</td><td style="padding:6px 0;color:#16161a">${escapeHtml(v)}</td></tr>`
    )
    .join("");
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px">
  <h2 style="margin:0 0 16px;color:#16161a">${escapeHtml(title)}</h2>
  <table style="border-collapse:collapse;font-size:14px">${rowHtml}</table>
  <div style="margin-top:16px;padding:14px 16px;border-left:3px solid #c9a24b;background:#faf7ef;color:#16161a;white-space:pre-wrap;font-size:15px;line-height:1.55">${escapeHtml(
    body
  )}</div>
</div>`;
}

/**
 * Send a notification email. Throws if Resend rejects it.
 * @param {{subject:string, title:string, rows:Array<[string,string]>, body:string, replyTo?:string}} msg
 */
export async function notify({ subject, title, rows, body, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject,
      html: layout(title, rows, body),
      text: `${title}\n\n${rows
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")}\n\n${body}`,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isEmail = (s) => typeof s === "string" && s.length <= 254 && EMAIL_RE.test(s);

/** Trim a string field and enforce a max length; returns "" for non-strings. */
export const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
