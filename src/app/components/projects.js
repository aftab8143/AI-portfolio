"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Rocket, RocketIcon } from "lucide-react";
import ProjectCard from "@/app/components/ProjectCard"; // adjust if needed
import { projects } from "../../../data";

export default function Projects() {
  const searchParams = useSearchParams();
  const shouldLand = searchParams.get("land") === "true";

  const [showLandingRocket, setShowLandingRocket] = useState(shouldLand);

  useEffect(() => {
    if (shouldLand) {
      const timer = setTimeout(() => setShowLandingRocket(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldLand]);

  return (
    <section
      id="project-section"
      className="relative min-h-screen pt-12 px-4 md:px-8 max-w-6xl mx-auto"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Projects</h1>
        <p style={{ color: "var(--text-muted)" }} className="max-w-2xl mx-auto">
          A selection of production apps I&apos;ve built for clients — web,
          mobile, and everything in between.
        </p>
      </div>
      {/* Landing rocket animation */}
      {showLandingRocket && (
        <motion.div
          initial={{ y: "-100vh", opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="fixed z-[100] top-0 left-1/2 transform -translate-x-1/2 pointer-events-none"
        >
          {showLandingRocket && (
            <motion.div
              initial={{ y: -300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center"
            >
              {/* 🚀 Rocket */}
              <RocketIcon
                size={32}
                className="drop-shadow-[0_0_20px_rgba(99,102,241,0.5)] z-10 [color:var(--text-light)]"
              />

              {/* 🔥 Thrust Flame */}
              <motion.div
                className="w-3 h-12 bg-gradient-to-b from-yellow-400 via-orange-500 to-transparent rounded-full blur-sm mt-[-4px]"
                animate={{ scaleY: [1, 1.6, 1], opacity: [0.8, 0.4, 0.8] }}
                transition={{ duration: 0.25, repeat: Infinity }}
              />

              {/* 💨 Smoke Particles */}
              <div className="relative mt-1">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bottom-0 w-3 h-3 bg-gray-300 rounded-full blur-sm opacity-50"
                    style={{
                      left: `${i * 10 - 20}px`,
                    }}
                    initial={{ y: 0, scale: 1, opacity: 0.4 }}
                    animate={{
                      y: [0, -30],
                      scale: [1, 1.8],
                      opacity: [0.4, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      <div className="project-grid">
        {projects.map((proj, idx) => (
          <ProjectCard key={idx} {...proj} />
        ))}
      </div>
    </section>
  );
}
