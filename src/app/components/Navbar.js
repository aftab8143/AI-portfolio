"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  // { label: "Demo", href: "/mockups" },
  // { label: "Blogs", href: "/blogs" },
  // { label: "Test", href: "/test" },
];

export default function Navbar() {
  const { theme, toggle } = useContext(ThemeContext);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Inside Navbar component
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-[#0f172a]/70 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Logo or Name */}
        {/* <Link href="/" className="text-cyan-400 font-bold text-lg">
          Aftab
        </Link> */}

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-white absolute left-6 top-4"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Desktop Links */}
        <div className="hidden sm:flex space-x-6 text-sm sm:text-base">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`transition duration-300 px-2 py-1 rounded-md ${
                  isActive
                    ? "text-cyan-400 border-b-2 border-cyan-400 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[52]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer sliding from LEFT */}
            <motion.div
              className="absolute top-0 left-0 w-1/2 h-screen bg-slate-900 text-white px-6 py-6 flex flex-col space-y-6 z-1000"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button onClick={() => setMenuOpen(false)}>
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Nav Links */}
              {navLinks.map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-base font-medium ${
                      isActive
                        ? "text-cyan-400"
                        : "text-white hover:text-cyan-300"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
