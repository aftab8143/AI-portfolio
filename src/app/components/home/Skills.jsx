"use client";

import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiNodedotjs,
  SiGraphql,
  SiElectron,
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
  SiDocker,
  SiGithubactions,
  SiCypress,
} from "react-icons/si";
import { motion } from "framer-motion";
import { BrainCogIcon, Sparkles } from "lucide-react";

const skillsByCategory = [
  {
    title: "Frontend",
    items: [
      { icon: <SiReact color="#61dafb" />, label: "React / Native" },
      { icon: <SiNextdotjs color="white" />, label: "Next.js" },
      // { icon: <SiAngular color="#dd0031" />, label: "Angular" },
      // { icon: <SiElectron color="#47848f" />, label: "Electron.js" },
      { icon: <SiTailwindcss color="#38bdf8" />, label: "Tailwind CSS" },
      { icon: <SiHtml5 color="#e34f26" />, label: "HTML" },
      { icon: <SiCss3 color="#1572b6" />, label: "CSS" },
    ],
  },
  {
    title: "Backend",
    items: [
      { icon: <SiNodedotjs color="#339933" />, label: "Node.js" },
      { icon: <SiGraphql color="#e535ab" />, label: "GraphQL" },
    ],
  },
  // {
  //   title: "AI / ML",
  //   items: [
  //     {
  //       icon: <Sparkles size={20} color="#a78bfa" />,
  //       label: "LLMs (OpenAI, Claude)",
  //     },
  //     {
  //       icon: <Sparkles size={20} color="#f472b6" />,
  //       label: "Langchain / Agents",
  //     },
  //   ],
  // },
  {
    title: "DevOps & Infra",
    items: [
      { icon: <SiAmazon color="#ff9900" />, label: "AWS" },
      { icon: <SiGooglecloud color="#4285f4" />, label: "GCP" },
      // { icon: <SiDocker color="#0db7ed" />, label: "Docker" },
      { icon: <SiGithubactions color="#2088ff" />, label: "GitHub Actions" },
      { icon: <SiCypress color="#58c4c4" />, label: "CI/CD / Cypress" },
    ],
  },
  {
    title: "Databases & Tools",
    items: [
      { icon: <SiMongodb color="#47a248" />, label: "MongoDB" },
      { icon: <SiMysql color="#00758f" />, label: "MySQL" },
      { icon: <SiPostgresql color="#336791" />, label: "PostgreSQL" },
      { icon: <SiFirebase color="#ffca28" />, label: "Firebase" },
      { icon: <SiGit color="#f05032" />, label: "Git / GitHub" },
      { icon: <SiJest color="#c21325" />, label: "Jest / Postman" },
    ],
  },
  {
    title: "Languages",
    items: [
      { icon: <SiJavascript color="#f7df1e" />, label: "JavaScript" },
      { icon: <SiTypescript color="#3178c6" />, label: "TypeScript" },
      // { icon: <SiPython color="#3776ab" />, label: "Python" },
    ],
  },
];

function Skills() {
  return (
    <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 text-white overflow-hidden">
      {/* Floating Blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[250px] h-[250px] bg-pink-400/20 rounded-full blur-[120px] animate-pulse pointer-events-none z-0" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-cyan-400/20 rounded-full blur-[120px] animate-pulse pointer-events-none z-0" />

      <motion.h2
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-14 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 z-10 relative"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <BrainCogIcon size={32} color="#f472b6" />
        <span>My Technical Stack</span>
      </motion.h2>

      {/* Skills Grid */}
      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 relative z-10">
        {skillsByCategory.map((category, i) => (
          <motion.div
            key={category.title}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_30px_#ec4899]/20 transition duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-pink-400 mb-4 text-center">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-4 align-center justify-center">
              {category.items.map((item, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col items-center text-sm text-slate-300 hover:text-white transition duration-200"
                  title={item.label}
                >
                  <div className="text-3xl group-hover:scale-110 transition-transform glow-icon">
                    {item.icon}
                  </div>
                  <span className="mt-1 text-xs text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
