const rowOne = [
  "React",
  "Next.js",
  "React Native",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "MongoDB",
  "PostgreSQL",
  "Firebase",
  "AWS",
  "GCP",
  "GitHub Actions",
  "OpenAI",
  "Claude",
];

const rowTwo = [
  { label: "App Store", on: true },
  { label: "Google Play", on: true },
  { label: "Production web apps", on: true },
  ...[...rowOne].reverse().map((label) => ({ label })),
];

function Row({ items, reverse }) {
  const chips = (hidden) =>
    items.map((item, i) => {
      const { label, on } = typeof item === "string" ? { label: item } : item;
      return (
        <span key={`${hidden ? "d" : "o"}-${i}`} className={`chip !px-5 !py-2.5 !text-[13px] ${on ? "on" : ""}`}>
          {label}
        </span>
      );
    });

  return (
    <div className="marquee">
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {chips(false)}
        {/* Duplicate set for a seamless loop */}
        <span aria-hidden="true" className="contents">
          {chips(true)}
        </span>
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section data-loc="marquee" aria-label="Technologies and platforms" className="relative border-y border-line py-7">
      <div className="grid gap-3">
        <Row items={rowOne} />
        <Row items={rowTwo} reverse />
      </div>
    </section>
  );
}
