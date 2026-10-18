"use client";

import { useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

const EMAIL = "aftab8143@gmail.com";

const contactItems = [
  { icon: FaEnvelope, label: "Email", text: EMAIL, href: `mailto:${EMAIL}` },
  { icon: FaGithub, label: "GitHub", text: "aftab8143", href: "https://github.com/aftab8143" },
  { icon: FaLinkedin, label: "LinkedIn", text: "Aftab Alam", href: "https://www.linkedin.com/in/aftab8143/" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", type: "" });
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // No backend: compose the enquiry in the visitor's mail client
  const onSubmit = (e) => {
    e.preventDefault();
    const subject = `Portfolio enquiry from ${form.name}${form.type ? ` — ${form.type}` : ""}`;
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <section data-loc="contact" id="contact" className="section scroll-mt-24">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <p className="eyebrow" data-reveal>
              Start here
            </p>
            <h2 className="h2 mt-4" data-reveal style={{ "--i": 1 }}>
              Let&apos;s talk about your project.
            </h2>
            <p className="lead mt-5" data-reveal style={{ "--i": 2 }}>
              Open to freelance projects, full-time roles and collaborations. One short message —
              I&apos;ll reply with a straight answer.
            </p>
            <ul className="mt-8 grid gap-3">
              {contactItems.map(({ icon: Icon, label, text, href }, i) => (
                <li key={label} data-reveal style={{ "--i": i + 3 }}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="glass spot flex items-center gap-4 p-4 text-hi hover:text-hi"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-line text-accent-2">
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="mono block text-[11px] uppercase tracking-widest text-lo">{label}</span>
                      <span className="block truncate text-[15px]">{text}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={onSubmit} className="glass grid gap-5 p-6 md:p-10" data-reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-[14px] text-mid">
                Your name *
                <input required className="field" value={form.name} onChange={update("name")} autoComplete="name" />
              </label>
              <label className="grid gap-2 text-[14px] text-mid">
                Email *
                <input
                  required
                  type="email"
                  className="field"
                  value={form.email}
                  onChange={update("email")}
                  autoComplete="email"
                />
              </label>
            </div>
            <label className="grid gap-2 text-[14px] text-mid">
              What can I help with?
              <select className="field" value={form.type} onChange={update("type")}>
                <option value="">Select…</option>
                <option>Freelance project</option>
                <option>Full-time role</option>
                <option>Collaboration</option>
                <option>Just saying hi</option>
              </select>
            </label>
            <label className="grid gap-2 text-[14px] text-mid">
              What are you building? *
              <textarea required rows={5} className="field resize-y" value={form.message} onChange={update("message")} />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="dim">Replies within one business day.</p>
              <button type="submit" className="btn btn-primary btn-lg" data-magnetic="0.2" data-cursor="Send">
                Send →
              </button>
            </div>
          </form>
        </div>
      </section>

      <section data-loc="final-cta" className="section" aria-labelledby="cta-h">
        <div className="wrap">
          <div className="glass spot relative overflow-hidden px-6 py-16 text-center md:px-16 md:py-24" data-reveal>
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              aria-hidden="true"
              style={{ background: "radial-gradient(60% 80% at 50% 0%, var(--glow-warm), transparent 70%)" }}
            />
            <h2 id="cta-h" className="h2 relative mx-auto max-w-[18ch]">
              Have an idea? Let&apos;s turn it into a <span className="grad-text">shipped product.</span>
            </h2>
            <p className="lead relative mx-auto mt-5">
              Web app, mobile app or AI feature — tell me what it should do and I&apos;ll tell you
              what it takes to build.
            </p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-3">
              <a href={`mailto:${EMAIL}`} className="btn btn-primary btn-xl" data-magnetic="0.25" data-cursor="Mail">
                Get in touch →
              </a>
            </div>
            <p className="dim relative mt-6">
              Or email <a href={`mailto:${EMAIL}`} className="underline underline-offset-4 text-mid hover:text-hi">{EMAIL}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
