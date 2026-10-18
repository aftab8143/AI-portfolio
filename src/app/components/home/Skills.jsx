import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiGraphql,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiAmazon,
  SiGooglecloud,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiFirebase,
  SiGit,
  SiJest,
  SiGithubactions,
  SiCypress,
  SiPython,
  SiOpenai,
  SiClaude,
  SiLangchain,
} from "react-icons/si";
import { Layers, Server, Cloud, Database, Code2, Sparkles, Plug, Bot, FileSearch, MessageSquareText } from "lucide-react";

const skillsByCategory = [
  {
    title: "AI & LLMs",
    icon: Sparkles,
    blurb: "AI agents that use real tools — LLMs connected to business systems over MCP and reachable from the chat apps teams already use.",
    wide: true,
    items: [
      { icon: SiPython, label: "Python" },
      { icon: SiOpenai, label: "OpenAI" },
      { icon: SiClaude, label: "Claude" },
      { icon: SiLangchain, label: "LangChain" },
      { icon: Plug, label: "MCP (Model Context Protocol)" },
      { icon: Bot, label: "AI Agents" },
      { icon: FileSearch, label: "RAG" },
      { icon: MessageSquareText, label: "Prompt & Context Engineering" },
    ],
  },
  {
    title: "Frontend",
    icon: Layers,
    blurb: "Fast, accessible interfaces for web and mobile.",
    items: [
      { icon: SiReact, label: "React / Native" },
      { icon: SiNextdotjs, label: "Next.js" },
      { icon: SiTailwindcss, label: "Tailwind CSS" },
      { icon: SiHtml5, label: "HTML" },
      { icon: SiCss3, label: "CSS" },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    blurb: "APIs, auth and real-time services built to scale.",
    items: [
      { icon: SiNodedotjs, label: "Node.js" },
      { icon: SiGraphql, label: "GraphQL" },
    ],
  },
  {
    title: "DevOps & Infra",
    icon: Cloud,
    blurb: "Pipelines and cloud deploys that just work.",
    items: [
      { icon: SiAmazon, label: "AWS" },
      { icon: SiGooglecloud, label: "GCP" },
      { icon: SiGithubactions, label: "GitHub Actions" },
      { icon: SiCypress, label: "CI/CD / Cypress" },
    ],
  },
  {
    title: "Databases & Tools",
    icon: Database,
    blurb: "The right store for the data, and the tooling around it.",
    items: [
      { icon: SiMongodb, label: "MongoDB" },
      { icon: SiMysql, label: "MySQL" },
      { icon: SiPostgresql, label: "PostgreSQL" },
      { icon: SiFirebase, label: "Firebase" },
      { icon: SiGit, label: "Git / GitHub" },
      { icon: SiJest, label: "Jest / Postman" },
    ],
  },
  {
    title: "Languages",
    icon: Code2,
    blurb: "Typed where it counts.",
    items: [
      { icon: SiJavascript, label: "JavaScript" },
      { icon: SiTypescript, label: "TypeScript" },
      { icon: SiPython, label: "Python" },
    ],
  },
];

export default function Skills() {
  return (
    <section data-loc="skills" id="skills" className="section scroll-mt-24">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          Technical stack
        </p>
        <h2 className="h2 mt-4" data-reveal style={{ "--i": 1 }}>
          Modern stack.
          <br />
          Production-proven.
        </h2>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillsByCategory.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className={`glass spot p-7 ${cat.wide ? "md:col-span-2" : ""}`}
                data-reveal
                style={{ "--i": i }}
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl border border-line text-accent-2"
                  style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
                >
                  <Icon size={20} />
                </span>
                <h3 className="h3 mt-5">{cat.title}</h3>
                <p className="muted mt-2 text-[15px]">{cat.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {cat.items.map(({ icon: ItemIcon, label }) => (
                    <li key={label} className="chip">
                      <ItemIcon size={13} className="text-accent-2" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="glass flex flex-col justify-center p-7 lg:col-span-2" data-reveal style={{ "--i": 6 }}>
            <p className="eyebrow">Recent work</p>
            <p className="h3 mt-4">
              Building AI agents end to end — LLMs, MCP tool integrations and chat channels like
              Slack, Teams and WhatsApp.
            </p>
            <a href="/demos" className="btn btn-glass mt-6 self-start">
              See AI demos →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
