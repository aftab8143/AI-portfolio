"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const PipelineScene = dynamic(() => import("./PipelineScene"), { ssr: false });

const steps = [
  { title: "Discover", text: "Goals, users and the one metric that matters. Clear scope before code." },
  { title: "Design", text: "Flows and UI states mapped out, so building is fast and predictable." },
  { title: "Build", text: "Typed, tested, reviewed. Working increments you can click every week." },
  { title: "Launch", text: "CI/CD, cloud deploys and App Store / Play Store submissions handled." },
  { title: "Scale", text: "Analytics, monitoring and iteration on real usage after go-live." },
];

// Pinned section: one invisible 70vh "slot" per step sits behind the sticky
// panel; whichever slot crosses the middle of the viewport is the active step
export default function Process() {
  const slotsRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const slots = Array.from(slotsRef.current.children);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.step));
        });
      },
      // A 1px band at the vertical centre of the viewport
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    slots.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Continuous 0 → 1 progress through the pinned stretch drives the 3D path.
  // Kept in a ref so scrolling doesn't re-render React; the scene reads it per frame.
  const wrapRef = useRef(null);
  const progressRef = useRef(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      progressRef.current = Math.min(Math.max(-r.top / total, 0), 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Only render the 3D scene while the section is on screen
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <section data-loc="process" aria-labelledby="proc-h">
      <div ref={wrapRef} className="relative">
        {/* Scroll slots that drive the active step (behind the sticky panel) */}
        <div ref={slotsRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[50vh]">
          {steps.map((s, i) => (
            <div key={s.title} data-step={i} className="h-[70vh]" />
          ))}
        </div>

        <div className="sticky top-0 h-screen overflow-hidden">
          {/* 3D gold pipeline: the glow travels and the camera flies along it */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <PipelineScene progressRef={progressRef} active={inView} />
          </div>

          <div className="wrap relative z-10 flex h-full flex-col justify-between py-[12vh]">
            <div>
              <p className="eyebrow">How I work</p>
              <h2 id="proc-h" className="h2 mt-4">
                From idea to launch, in five steps.
              </h2>
            </div>

            {/* Steps 1–3 sit bottom-left, 4–5 bottom-right */}
            <ol className="relative mt-auto min-h-[190px]">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className={`glass absolute bottom-0 w-full max-w-[560px] p-7 transition-all duration-500 ${
                    i < 3 ? "left-0" : "right-0"
                  } ${
                    i === active ? "opacity-100" : "pointer-events-none translate-y-6 opacity-0"
                  }`}
                  aria-current={i === active ? "step" : undefined}
                >
                  <span className="step-n">0{i + 1}</span>
                  <h3 className="h3 mt-2 !text-[36px]">{s.title}</h3>
                  <p className="muted mt-2">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <ol
            aria-hidden="true"
            className="absolute right-[clamp(16px,4vw,56px)] top-1/2 z-10 grid -translate-y-1/2 gap-4 max-md:hidden"
          >
            {steps.map((s, i) => (
              <li
                key={s.title}
                className={`mono flex items-center gap-3 text-[12px] transition-colors ${
                  i === active ? "text-accent-2" : "text-lo"
                }`}
              >
                <span className={`h-px transition-all ${i === active ? "w-10 bg-accent-2" : "w-5 bg-current"}`} />
                0{i + 1}
              </li>
            ))}
          </ol>
        </div>
        {/* Extra scroll length so every step gets its slot while pinned */}
        <div aria-hidden="true" style={{ height: `${steps.length * 70}vh` }} />
      </div>
    </section>
  );
}
