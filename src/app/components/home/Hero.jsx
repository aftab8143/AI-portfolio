"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const lineOne = "Building products people".split(" ");
const lineTwo = "love to use.".split(" ");

// Headline split into per-character spans so each letter can flip in
function SplitLine({ words, startIndex, className = "" }) {
  let ci = startIndex;
  return words.map((word, wi) => (
    <span key={wi}>
      <span className="split-word" aria-hidden="true">
        {word.split("").map((ch) => (
          <span key={ci} className={`split-char ${className}`} style={{ "--ci": ci++ }}>
            {ch}
          </span>
        ))}
      </span>{" "}
    </span>
  ));
}

export default function HomeHero() {
  const lineOneChars = lineOne.join("").length;

  return (
    <section data-loc="hero" className="relative flex min-h-[100svh] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-35 md:left-[38%] md:opacity-100"
        aria-hidden="true"
      >
        <HeroScene />
      </div>

      <div className="wrap relative z-10 flex flex-col justify-center pb-24 pt-[calc(var(--nav-h)+48px)]">
        <p className="eyebrow hero-rise" style={{ "--i": 0 }}>
          Full Stack · React Native · AI Integration
        </p>

        <h1
          className="display mt-6 max-w-[14ch] text-hi"
          aria-label="Building products people love to use."
          style={{ perspective: "900px" }}
        >
          <SplitLine words={lineOne} startIndex={0} />
          <br aria-hidden="true" />
          <SplitLine words={lineTwo} startIndex={lineOneChars} className="grad-text" />
        </h1>

        <p className="lead hero-rise mt-7 max-w-[56ch]" style={{ "--i": 2 }}>
          I&apos;m <strong className="font-semibold text-hi">Aftab Alam</strong>, a full
          stack developer shipping{" "}
          <strong className="font-semibold text-hi">web & mobile apps</strong> with
          Next.js, Node and React Native — with AI built in. Production apps, live on the
          stores, built end to end.
        </p>

        <div className="hero-rise mt-9 flex flex-wrap gap-3" style={{ "--i": 3 }}>
          <Link
            href="/projects"
            className="btn btn-primary btn-lg"
            data-magnetic="0.25"
            data-cursor="View"
          >
            View my work →
          </Link>
          <a
            href="https://www.linkedin.com/in/aftab8143/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-glass btn-lg"
            data-magnetic="0.2"
          >
            Connect with me
          </a>
        </div>

        <p className="dim hero-rise mt-7 flex items-center gap-2" style={{ "--i": 4 }}>
          <span
            className="inline-block h-2 w-2 rounded-full bg-success shadow-[0_0_10px_var(--success)]"
            aria-hidden="true"
          />
          Available for freelance & full-time roles · Shipping production apps since 2022
        </p>
      </div>

      <div
        aria-hidden="true"
        className="mono absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[11px] uppercase tracking-[.3em] text-lo"
      >
        Scroll
      </div>
    </section>
  );
}
