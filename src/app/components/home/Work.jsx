"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "../../../../data";

const isMobileApp = (p) => p.tags.some((t) => /react native|android|ios/i.test(t));
const cleanTitle = (t) => t.replace(/\s*\(.*\)\s*$/, "");
const subtitle = (p) =>
  `${isMobileApp(p) ? "Mobile app" : "Web platform"} · ${p.tags.slice(0, 2).join(" + ")}`;

function PhoneFrame({ src, tilt }) {
  return (
    <div className="phone-frame h-full" style={{ transform: tilt }}>
      <div className="phone-screen overflow-hidden rounded-[10%/5%] bg-[#0d0f16]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
        <span className="absolute left-1/2 top-[2.2%] h-[2.4%] w-[26%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

function BrowserFrame({ src }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-line-strong bg-[#12141a] shadow-[0_40px_120px_-30px_rgba(201,162,75,.6)]"
      // 16:9 screenshot + ~44px title bar must fit the showcase's height
      style={{
        width: "min(820px, 100%, calc((88cqh - 44px) * 16 / 9))",
        transform: "perspective(1200px) rotateX(8deg)",
      }}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover object-top" />
    </div>
  );
}

// Pinned showcase: one invisible 70vh scroll slot per project sits behind the
// sticky panel; the slot crossing the middle of the viewport is the active one
export default function Work() {
  const slotsRef = useRef(null);
  const [index, setIndex] = useState(0);
  const current = projects[index];
  const images = current.images?.length ? current.images : [current.displayImage];

  useEffect(() => {
    const slots = Array.from(slotsRef.current.children);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIndex(Number(entry.target.dataset.slot));
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    slots.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Arrows scroll to the neighbouring slot so the page position stays in sync
  const go = (d) => {
    const next = (index + d + projects.length) % projects.length;
    const slot = slotsRef.current.children[next];
    const r = slot.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + r.top + r.height / 2 - window.innerHeight / 2,
      behavior: "smooth",
    });
  };

  return (
    <section data-loc="work" aria-labelledby="work-h">
      <div className="relative">
        {/* Scroll slots that drive the active project (behind the sticky panel) */}
        <div ref={slotsRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[50vh]">
          {projects.map((p, i) => (
            <div key={p.slug} data-slot={i} className="h-[70vh]" />
          ))}
        </div>

        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div className="wrap flex min-h-0 flex-1 flex-col pb-6 pt-[calc(var(--nav-h)+28px)]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Selected work</p>
                <h2 id="work-h" className="h2 mt-3">
                  Apps I&apos;ve shipped.
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="mono text-[12px] tracking-widest text-lo">
                  <span className="text-accent-2">0{index + 1}</span> / 0{projects.length}
                </span>
                <Link href="/projects" className="btn btn-glass max-sm:hidden">
                  Explore all projects →
                </Link>
              </div>
            </div>

            {/* Showcase fills whatever height is left */}
            <div className="relative mt-4 grid min-h-0 w-full flex-1 place-items-center [container-type:size]">
              <div
                className="absolute inset-[10%] opacity-70 blur-2xl"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(201,162,75,.5), transparent 70%), radial-gradient(closest-side at 65% 60%, rgba(242,218,140,.35), transparent 70%)",
                }}
              />
              <div key={current.slug} className="fade-in relative flex h-[min(88cqh,84cqw)] w-full items-center justify-center gap-[4cqw]">
                {isMobileApp(current) ? (
                  <>
                    <PhoneFrame src={images[0]} tilt="perspective(900px) rotateY(18deg) rotateZ(3deg)" />
                    {images[1] && (
                      <PhoneFrame src={images[1]} tilt="perspective(900px) rotateY(-18deg) rotateZ(-3deg)" />
                    )}
                  </>
                ) : (
                  <BrowserFrame src={current.displayImage} />
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                aria-label="Previous project"
                onClick={() => go(-1)}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line-strong bg-bg-1/70 text-hi hover:bg-white/10"
              >
                <ChevronLeft size={20} />
              </button>
              <Link
                href={`/projects/${current.slug}`}
                className="glass min-w-0 max-w-[520px] flex-1 p-5 text-center text-hi hover:text-hi"
                data-cursor="View"
                aria-live="polite"
              >
                <span className="mono text-[11px] uppercase tracking-widest text-accent-2">
                  {isMobileApp(current) ? "iOS & Android app" : "Web platform"}
                </span>
                <span className="h3 mt-1 block">{cleanTitle(current.title)}</span>
                <span className="muted mt-1 block text-[14.5px]">{subtitle(current)}</span>
                <span className="mt-3 flex flex-wrap justify-center gap-2 max-sm:hidden">
                  {current.tags.slice(0, 3).map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </span>
              </Link>
              <button
                aria-label="Next project"
                onClick={() => go(1)}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line-strong bg-bg-1/70 text-hi hover:bg-white/10"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        {/* Extra scroll length so every project gets its slot while pinned */}
        <div aria-hidden="true" style={{ height: `${projects.length * 70}vh` }} />
      </div>

      {/* Index list */}
      <div className="wrap pb-[clamp(72px,10vw,150px)]">
        <ol className="border-t border-line">
          {projects.map((p, i) => (
            <li key={p.slug} data-reveal style={{ "--i": i }}>
              <Link
                href={`/projects/${p.slug}`}
                data-cursor="View"
                className="group grid grid-cols-[32px_minmax(0,1fr)] items-center gap-x-4 gap-y-2 border-b border-line py-6 text-hi transition-[border-color] duration-300 hover:border-accent hover:text-hi md:grid-cols-[56px_minmax(0,1fr)_auto] md:gap-x-6"
              >
                <span className="mono text-[12px] text-accent-2">0{i + 1}</span>
                <span className="min-w-0">
                  <span className="block font-display text-[clamp(26px,3.6vw,54px)] font-semibold leading-[1.02] tracking-tight transition-transform duration-500 group-hover:translate-x-3">
                    {cleanTitle(p.title)}
                  </span>
                  <span className="dim mt-2 block">{subtitle(p)}</span>
                </span>
                <span className="flex items-center gap-4 max-md:col-start-2">
                  <span className="chip">{p.tags[0]}</span>
                  <span
                    aria-hidden="true"
                    className="text-[28px] leading-none text-accent-2 transition-transform duration-500 group-hover:translate-x-2"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
