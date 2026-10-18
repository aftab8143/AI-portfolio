import Image from "next/image";

export default function About() {
  return (
    <section data-loc="about" id="about" className="section scroll-mt-24">
      <div className="wrap">
        <div className="glass spot grid overflow-hidden md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" data-reveal>
          <div className="relative min-h-[360px] overflow-hidden">
            <Image
              src="/personal/profile1.jpeg"
              alt="Aftab Alam"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-0)] via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-3">
              <span
                className="grid h-10 w-10 place-items-center rounded-full font-display text-[13px] font-bold text-[var(--on-accent)]"
                style={{ background: "var(--grad)" }}
              >
                AA
              </span>
              <span className="text-[14px] text-hi">
                Aftab Alam · <span className="text-mid">Full Stack Developer</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center p-7 md:p-12">
            <p className="eyebrow">About me</p>
            <h2 className="h2 mt-4 !text-[clamp(30px,3.6vw,54px)]">
              Aftab Alam — <span className="grad-text">Full Stack Developer</span>
            </h2>
            <p className="mt-6 font-display text-[22px] italic text-accent-ink">
              “Ship, then polish.”
            </p>
            <p className="muted mt-5 max-w-[60ch] text-[17px] leading-relaxed">
              I build dynamic apps across mobile and web — from QA automation roots to React
              Native apps on both stores and full stack Next.js platforms. My work focuses on
              performance, usability and modern tech like LLMs, microservices and real-time
              communication.
            </p>
            <p className="muted mt-4 max-w-[60ch] text-[17px] leading-relaxed">
              The developer who scopes, builds and ships your product is the person you talk to —
              no hand-offs, clear communication and code you fully own.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/aftab-resume.pdf" download className="btn btn-primary" data-magnetic="0.2">
                Download résumé
              </a>
              <a
                href="https://www.linkedin.com/in/aftab8143/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass"
              >
                Connect on LinkedIn →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
