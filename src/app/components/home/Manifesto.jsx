"use client";

import { useEffect, useRef } from "react";

const values = [
  { line: "Ship, then polish.", note: "Working software in users' hands beats a perfect plan on paper." },
  { line: "Quality is a feature.", note: "Started in QA — tests and stability come built in, not bolted on." },
  { line: "Own it end to end.", note: "From database schema to App Store review, I see it through." },
];

export default function Manifesto() {
  const listRef = useRef(null);

  // Fill each line left → right as it travels from the bottom of the
  // viewport (85%) to just above the middle (45%)
  useEffect(() => {
    const lines = Array.from(listRef.current.querySelectorAll(".manifesto-line"));
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      lines.forEach((el) => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const p = (vh * 0.85 - center) / (vh * 0.4);
        el.style.setProperty("--fill", Math.min(Math.max(p, 0), 1).toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section data-loc="manifesto" className="section" aria-labelledby="manifesto-h">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          What I value
        </p>
        <h2 id="manifesto-h" className="sr-only">
          How I work.
        </h2>
        <ol ref={listRef} className="mt-10 grid gap-10 md:gap-14">
          {values.map((v) => (
            <li
              key={v.line}
              className="grid items-end gap-3 border-b border-line pb-10 md:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] md:gap-10 md:pb-14"
            >
              <p className="manifesto-line font-display text-[clamp(40px,7.2vw,120px)] font-semibold leading-[0.98] tracking-[-0.03em]">
                {v.line}
              </p>
              <p className="muted max-w-[34ch] text-[17px] md:pb-3" data-reveal>
                {v.note}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
