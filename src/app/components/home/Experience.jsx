const experience = [
  {
    title: "Software Engineer",
    company: "Jharkhand Space Applications Centre (JSAC)",
    duration: "Jun 2026 – Present",
    description:
      "Working on the JIADA Unified IT System for the Jharkhand Industrial Area Development Authority.",
    highlights: [
      "One portal for plot search, land bank and land allotment across 160 industrial areas",
      "Online investor services: building plan approval, lease transfer, unit certificates",
      "Applicant dashboard with region-wise plot availability and a land map",
      "Next: a land survey mobile app for field teams",
    ],
    stack: [],
    terminal: ["$ git checkout jiada-unified-it", "✓ joined JSAC · Jun 2026", "→ building now"],
  },
  {
    title: "Full Stack & AI Engineer",
    company: "Jai Infoway Pvt. Ltd.",
    duration: "Feb 2025 – Apr 2026",
    description: "Built AI agents and the full stack platforms around them.",
    // Shown as two side-by-side columns instead of one highlight list
    tracks: [
      {
        title: "AI Agents & MCP",
        highlights: [
          "Seven business AI agents for Intellibooks Studio — capital markets, lead generation, outreach and more",
          "Agent control from Slack, Telegram, WhatsApp, Discord and Microsoft Teams",
          "Koodums: connect your own MCP server in 3 steps and use its tools in chat",
        ],
        stack: ["Python", "OpenAI", "Claude", "MCP", "AI Agents"],
      },
      {
        title: "Web Platforms",
        highlights: [
          "PetLinx: appointment audit log tracking payments, refunds, date and run changes",
          "Google auth + email verification, and S3 profile uploads with cropping",
          "Invite-based employee onboarding and modular, microservice-style APIs",
        ],
        stack: ["Next.js", "Node.js", "PostgreSQL", "Firebase", "AWS S3"],
      },
    ],
  },
  {
    title: "Mobile App Developer",
    company: "Jai Infoway Pvt. Ltd.",
    duration: "Jan 2023 – Feb 2025",
    description:
      "Built feature-rich iOS & Android apps with precise UI, platform-specific optimisation, in-app purchases, parental controls and post-launch iteration driven by analytics.",
    highlights: [
      "Reward tracking, dynamic links and interactive billing flows",
      "Braze, Mixpanel and Google Maps SDK integrations",
      "Deep linking and push campaigns for user acquisition",
    ],
    stack: ["React Native", "Node.js", "MongoDB", "AWS", "GCP"],
    terminal: ["$ eas submit --platform all", "✓ App Store · approved", "✓ Google Play · live"],
  },
  {
    title: "Test Automation Engineer",
    company: "Jai Infoway Pvt. Ltd.",
    duration: "May 2022 – Jan 2023",
    description:
      "Built the automation pipelines behind stable releases — integration suites in CI/CD and close collaboration with developers on test-driven delivery.",
    highlights: [
      "Cypress suites integrated into CI/CD",
      "Regression tracking and sprint retro improvements",
      "QA lead on staging for finance & trading features",
    ],
    stack: ["Cypress", "JavaScript", "JIRA", "Postman"],
    terminal: ["$ cypress run --record", "✓ all specs passing", "→ report uploaded to CI"],
  },
];

function Highlights({ items }) {
  return (
    <ul className="mt-5 grid gap-2">
      {items.map((h) => (
        <li key={h} className="flex gap-3 text-[15px] text-mid">
          <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent-2" aria-hidden="true" />
          {h}
        </li>
      ))}
    </ul>
  );
}

function Stack({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="chip">
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function Experience() {
  return (
    <section data-loc="experience" aria-labelledby="exp-h">
      <div className="section">
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            What I do
          </p>
          <h2 id="exp-h" className="h2 mt-4" data-reveal style={{ "--i": 1 }}>
            Every layer of the stack,
            <br />
            covered.
          </h2>
          <p className="lead mt-4" data-reveal style={{ "--i": 2 }}>
            AI agents, web, mobile and quality engineering — I&apos;ve worked every layer, so
            features ship faster with fewer hand-offs.
          </p>
        </div>

        <div className="wrap mt-10 grid gap-5">
          {experience.map((job, i) => (
            <article
              key={job.title}
              className={`glass spot grid overflow-hidden ${job.tracks ? "" : "sm:grid-cols-2"}`}
              data-reveal
            >
              <div className="flex flex-col justify-between p-7 md:p-10">
                <div>
                  <span className="step-n">0{i + 1}</span>
                  <h3 className="h3 mt-3 !text-[clamp(26px,2.6vw,40px)]">{job.title}</h3>
                  <p className="mono mt-2 text-[12px] uppercase tracking-widest text-lo">
                    {job.company} · {job.duration}
                  </p>
                  <p className="muted mt-4 max-w-[48ch]">{job.description}</p>
                  {job.tracks ? (
                    <div className="mt-7 grid gap-4 md:grid-cols-2">
                      {job.tracks.map((track) => (
                        <div key={track.title} className="flex flex-col justify-between rounded-2xl border border-line bg-bg-1/40 p-6">
                          <div>
                            <p className="eyebrow">{track.title}</p>
                            <Highlights items={track.highlights} />
                          </div>
                          <Stack items={track.stack} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Highlights items={job.highlights} />
                  )}
                </div>
                {!job.tracks && <Stack items={job.stack} />}
              </div>

              {/* Visual side: glowing orb behind a small terminal readout */}
              {job.terminal && (
              <div className="relative grid min-h-[260px] place-items-center p-8" aria-hidden="true">
                <div
                  className="absolute inset-[8%] opacity-80 blur-2xl"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(201,162,75,.45), transparent 70%), radial-gradient(closest-side at 65% 60%, rgba(242,218,140,.3), transparent 70%)",
                  }}
                />
                <div className="relative w-full max-w-[380px] rounded-2xl border border-line-strong bg-bg-1/80 p-5 shadow-[0_30px_80px_-30px_rgba(201,162,75,.5)] backdrop-blur">
                  <div className="mb-4 flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b81]/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e8a33d]/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                  </div>
                  {job.terminal.map((line, li) => (
                    <p
                      key={line}
                      className={`mono text-[13px] leading-7 ${li === 0 ? "text-hi" : "text-accent-2"}`}
                    >
                      {line}
                    </p>
                  ))}
                  <p className="mono mt-1 inline-flex items-center gap-2 text-[13px] text-lo">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
                    ready
                  </p>
                </div>
              </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
