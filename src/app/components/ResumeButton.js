"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ResumeButton() {
  const pathname = usePathname();
  if (pathname === "/") {
    return (
      <div className="fixed top-4 right-0 z-[51] flex flex-col items-center group">
        <motion.a
          href="/aftab-resume.pdf"
          download
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
          className="text-cyan hover:text-blue transition-all duration-300"
          aria-label="Download Resume"
        >
          {/* Animated Download Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-cyan"
          >
            <motion.path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <motion.polyline
              points="7 10 12 15 17 10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeInOut" }}
            />
            <motion.line
              x1="12"
              y1="15"
              x2="12"
              y2="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeInOut" }}
            />
          </svg>
        </motion.a>

        <span className="mt-2 px-2 py-1 text-xs bg-slate-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Download Resume
        </span>
      </div>
    );
  }

  return null; // Don't show the button on other pages
}
