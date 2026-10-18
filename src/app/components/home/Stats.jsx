"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects } from "../../../../data";

const stats = [
  { value: projects.length, suffix: "+", label: "Production apps shipped for clients", cta: "See the apps", href: "/projects" },
  { value: 2022, suffix: "", label: "Shipping production code since", cta: "My journey", href: "/#about", plain: true },
  { value: 4, suffix: "", label: "Roles: QA → Mobile → Full stack & AI → Software Engineer", cta: "Experience", href: "/#about" },
  { value: 7, suffix: "", label: "Business AI agents built for Intellibooks Studio", cta: "See the agents", href: "/projects/intellibooks-studio" },
];

// Counts up once the number scrolls into view
function CountUp({ to, plain }) {
  const ref = useRef(null);
  const [n, setN] = useState(plain ? to : 0);

  useEffect(() => {
    if (plain) return;
    const el = ref.current;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1400;
      const step = (now) => {
        const t = Math.min((now - start) / dur, 1);
        setN(Math.round(to * (1 - Math.pow(1 - t, 4))));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to, plain]);

  return <span ref={ref}>{n}</span>;
}

export default function Stats() {
  return (
    <section data-loc="stats" className="section">
      <div className="wrap">
        <div className="max-w-[980px]">
          <p className="eyebrow" data-reveal>
            Track record
          </p>
          <h2 className="h2 mt-4" data-reveal style={{ "--i": 1 }}>
            Real apps. Real users.
            <br />
            Live in production today.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Link
              key={s.label}
              href={s.href}
              className="glass spot group block p-7 text-hi hover:text-hi"
              data-reveal
              data-cursor="View"
              style={{ "--i": i }}
            >
              <div className="stat-num font-display text-[clamp(64px,7vw,112px)] font-bold leading-none tracking-tighter">
                <CountUp to={s.value} plain={s.plain} />
                {s.suffix}
              </div>
              <p className="muted mt-5 text-[15px]">{s.label}</p>
              <p className="mt-4 text-[14px] text-accent-2 opacity-70 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                {s.cta} →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
