"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sun, Moon, Download } from "lucide-react";

const navLinks = [
  { label: "Work", href: "/projects" },
  { label: "Demos", href: "/demos" },
  { label: "Blog", href: "/blogs" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function LogoMark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-xl font-display text-[13px] font-bold tracking-wide text-[var(--on-accent)]"
        style={{ background: "var(--grad)" }}
      >
        AA
      </span>
      <span className="font-display text-[15px] font-semibold leading-none tracking-[0.04em] text-hi max-[520px]:flex max-[520px]:flex-col max-[520px]:gap-[3px] max-[520px]:text-[14px]">
        AFTAB{" "}
        <span className="font-normal tracking-[0.12em] text-accent-ink max-[520px]:text-[9.5px]">
          ALAM
        </span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const { theme, toggle } = useContext(ThemeContext);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = (href) => !href.includes("#") && pathname.startsWith(href);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-3">
        <nav
          aria-label="Primary"
          className="glass mx-auto flex h-[var(--nav-h)] max-w-[1440px] items-center justify-between gap-4 !rounded-full px-4 md:px-6"
        >
          <Link href="/" aria-label="Aftab Alam — home" className="shrink-0 hover:text-hi">
            <LogoMark />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-full px-3 py-2 text-[14.5px] transition-colors hover:text-hi ${
                    isActive(href) ? "text-hi" : "text-mid"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <a
              href="/aftab-resume.pdf"
              download
              className="hidden h-10 items-center gap-2 rounded-full border border-line px-3 text-[13px] text-mid hover:text-hi md:flex"
              aria-label="Download résumé"
            >
              <Download size={14} />
              <span className="mono text-[11px] uppercase tracking-wider">Résumé</span>
            </a>
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="grid h-10 w-10 place-items-center rounded-full text-mid hover:text-hi"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link
              href="/#contact"
              className="btn btn-primary hidden !min-h-[42px] !px-5 !text-[14px] sm:inline-flex"
              data-magnetic="0.2"
              data-cursor="Hire"
            >
              Hire me
            </Link>
            <button
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-hi lg:hidden"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[90] bg-[var(--bg-0)]/90 px-6 pb-10 pt-[calc(var(--nav-h)+40px)] backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="grid gap-2">
              {navLinks.map(({ label, href }, i) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4 border-b border-line py-4 font-display text-[clamp(32px,8vw,48px)] font-semibold tracking-tight text-hi"
                  >
                    <span className="step-n">0{i + 1}</span>
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#contact" onClick={() => setMenuOpen(false)} className="btn btn-primary">
                Hire me
              </Link>
              <a href="/aftab-resume.pdf" download className="btn btn-glass">
                Download résumé
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
