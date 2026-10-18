import Link from "next/link";
import { LogoMark } from "./Navbar";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/projects" },
      { label: "Demos", href: "/demos" },
      { label: "Blog", href: "/blogs" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Experience", href: "/#about" },
      { label: "Skills", href: "/#skills" },
      { label: "Résumé", href: "/aftab-resume.pdf" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "GitHub", href: "https://github.com/aftab8143" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/aftab8143/" },
      { label: "Email", href: "mailto:aftab8143@gmail.com" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer relative border-t border-line">
      <div className="wrap pb-10 pt-[clamp(72px,9vw,130px)]">
        <p className="eyebrow">React · Next.js · React Native · AI</p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-8">
          <h2 className="display max-w-[12ch]">
            Let&apos;s <span className="grad-text">build it.</span>
          </h2>
          <div className="flex flex-col items-start gap-4">
            <a
              href="mailto:aftab8143@gmail.com"
              className="btn btn-primary btn-lg"
              data-magnetic="0.25"
              data-cursor="Mail"
            >
              Start a project →
            </a>
            <a href="mailto:aftab8143@gmail.com" className="text-[15px] text-mid hover:text-hi">
              aftab8143@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-line pt-12 md:grid-cols-[minmax(0,5fr)_repeat(3,minmax(0,2fr))]">
          <div>
            <LogoMark />
            <p className="muted mt-5 max-w-[38ch] text-[15px]">
              Full stack & mobile developer building fast, polished web and app
              experiences with modern tooling and AI built in.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-lo">{col.title}</h2>
              <ul className="mt-4 grid gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("/") && !l.href.endsWith(".pdf") ? (
                      <Link href={l.href} className="text-[15px] text-mid hover:text-hi">
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-[15px] text-mid hover:text-hi"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="dim">© {new Date().getFullYear()} Aftab Alam. All rights reserved.</p>
          <p className="mono text-[11px] uppercase tracking-[0.3em] text-lo">Built with Next.js</p>
        </div>
      </div>
    </footer>
  );
}
