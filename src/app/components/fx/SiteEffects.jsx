"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Global background layers + pointer/scroll driven effects shared by every page:
// fluid glow, grid lines, grain, scroll progress, custom cursor, card spotlight,
// scroll reveals and magnetic buttons.
export default function SiteEffects() {
  const pathname = usePathname();
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  // Pointer + scroll driven CSS variables and the custom cursor
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onScroll = () => {
      const max = root.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty("--progress", p.toFixed(4));
      root.style.setProperty("--sy", p.toFixed(4));
    };

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      root.style.setProperty("--mx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));

      // Spotlight + tilt on the card under the pointer
      const card = e.target.closest?.(".spot");
      if (card) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--sx", `${x * 100}%`);
        card.style.setProperty("--sy", `${y * 100}%`);
        if (!reduce) {
          card.style.setProperty("--px", (x - 0.5).toFixed(3));
          card.style.setProperty("--py", (y - 0.5).toFixed(3));
        }
      }

      // Cursor label from the nearest [data-cursor]
      const ring = ringRef.current;
      if (ring) {
        const target = e.target.closest?.("[data-cursor]");
        const label = target?.getAttribute("data-cursor") || "";
        if (ring.textContent !== label) ring.textContent = label;
        ring.classList.toggle("has-label", !!label);
      }
    };

    const onLeaveCard = (e) => {
      const card = e.target.closest?.(".spot");
      if (card && !card.contains(e.relatedTarget)) {
        card.style.setProperty("--px", "0");
        card.style.setProperty("--py", "0");
      }
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onLeaveCard, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeaveCard);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll reveals and magnetic buttons; re-scanned on every route change
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    const scan = () =>
      document.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => io.observe(el));
    scan();
    // Catch sections that mount after hydration (dynamic imports, client data)
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    const magnets = reduce ? [] : Array.from(document.querySelectorAll("[data-magnetic]"));
    const handlers = magnets.map((el) => {
      const strength = parseFloat(el.getAttribute("data-magnetic")) || 0.2;
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      };
      const leave = () => {
        el.style.transform = "";
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return { el, move, leave };
    });

    return () => {
      io.disconnect();
      mo.disconnect();
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
    };
  }, [pathname]);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="bg-fluid" aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
