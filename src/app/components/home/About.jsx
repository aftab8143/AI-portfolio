"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaPython, FaUnlockAlt } from "react-icons/fa";
import { SiNextdotjs, SiMongodb, SiAngular, SiFirebase } from "react-icons/si";

function FlippableProfile() {
  const [code, setCode] = useState("");
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (code.trim().toLowerCase() === "ballu & soni") {
      setFlipped((prev) => !prev);
    }
  };

  return (
    <div className="relative w-40 h-40 perspective mx-auto mb-10 group">
      {/* Card Inner */}
      <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
        {/* Front Face */}
        <div className="flip-card-front border-1 border-slate-700 shadow-lg relative">
          <Image
            src="/personal/profile1.jpg"
            alt="Aftab Alam"
            fill
            className="object-contain rounded-full"
          />
        </div>
        {/* Back Face */}
        <div className="flip-card-back">
          <Image
            src="/personal/2.jpg"
            alt="Ballu & Soni"
            fill
            className="object-cover rounded-full"
          />
        </div>
      </div>

      {/* 👇 Input & Button - visible only on hover */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded-md shadow-lg">
          <input
            type="text"
            placeholder="Secret code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="px-2 py-1 rounded-md text-xs text-white bg-slate-700 w-28"
          />
          <button
            onClick={handleFlip}
            className="text-white bg-pink-500 p-2 rounded-full hover:bg-pink-600"
          >
            <FaUnlockAlt size={14} />
          </button>
        </div>
      </div>

      {/* Flip CSS */}
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s ease-in-out;
          transform-style: preserve-3d;
        }
        .flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 9999px;
          overflow: hidden;
          top: 0;
          left: 0;
        }
        .flip-card-front {
          z-index: 2;
          transform: rotateY(0deg);
        }
        .flip-card-back {
          transform: rotateY(180deg);
          z-index: 1;
        }
      `}</style>
    </div>
  );
}

export default function About() {
  return (
    <section className="bg-transparent py-20 px-6 text-white">
      <div className="max-w-5xl mx-auto text-center">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <FlippableProfile />
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          About Me
        </motion.h2>

        <p className="text-slate-300 max-w-3xl mx-auto">
          I’m a{" "}
          <span className="text-pink-400 font-semibold">
            full-stack developer
          </span>{" "}
          with 3+ years of experience building dynamic apps across mobile and
          web. My work focuses on performance, usability, and integrating modern
          tech like LLMs, microservices, and real-time communication.
        </p>

        {/* Tech Icons */}
        <div className="flex justify-center items-center flex-wrap gap-6 text-4xl mt-4">
          <span className="icon-metal text-[#61DAFB]">
            <FaReact />
          </span>
          <span className="icon-metal text-white">
            <SiNextdotjs />
          </span>
          <span className="icon-metal text-[#339933]">
            <FaNodeJs />
          </span>
          <span className="icon-metal text-[#47A248]">
            <SiMongodb />
          </span>
          {/* <span className="icon-metal text-[#DD0031]">
            <SiAngular />
          </span> */}
          <span className="icon-metal text-[#FFCA28]">
            <SiFirebase />
          </span>
          {/* <span className="icon-metal text-[#3776AB]">
            <FaPython />
          </span> */}
        </div>

        {/*  Work Experience */}
        {/* <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-cyan-400 mb-12">
             Work Experience
          </h3>

          <div className="space-y-8 max-w-3xl mx-auto">
            {[
              {
                title: "Full Stack Developer",
                company: "Jai Infoway Pvt. Ltd.",
                duration: "Nov 2024 – Present",
                description:
                  "As a full stack developer, I led the end-to-end development of web applications, translating product ideas into production-grade features. I collaborated with cross-functional teams to design scalable architecture and deliver performant solutions. Emphasis was placed on enhancing platform security, seamless user onboarding, and robust profile management. I also introduced microservice-style modular APIs to enable flexible business logic deployment.",
                tech: "Next.js, Node.js, PostgreSQL, Firebase, Google Auth, AWS S3",
              },
              {
                title: "Mobile App Developer",
                company: "Jai Infoway Pvt. Ltd.",
                duration: "Nov 2022 – Nov 2024",
                description:
                  "Developed cross-platform mobile applications with optimized performance and responsive UIs. Task assignment, reward systems, credit simulation. Braze & Mixpanel integration for campaign management. Push notifications and parental control. In-App purchase integration for Android and IOS. Revamped the entire UI to enhance user experience and make the app more intuitive. Implemented table selection using long press and single tap for multiple use cases, improving order flow efficiency. Simplified the order-to-billing process by streamlining steps, reducing waiter effort and improving speed. Implemented dynamic linking to allow users to open a specific product directly via a shared link. Integrated Google Maps API to visually represent distance between requester and receiver in real-time. Enhanced user experience by enabling seamless navigation and accurate location-based tracking.",
                tech: "React Native, Node.js, MongoDB, AWS, GCP, AppleConnect, React Navigation, Google Maps API, Firebase Dynamic Links",
              },
              {
                title: "Test Automation Engineer",
                company: "Jai Infoway Pvt. Ltd.",
                duration: "May 2021 – Nov 22",
                description:
                  "Created and executed test cases to validate core trading features and user workflows. Automated end-to-end tests using Cypress to ensure consistent performance across releases. Performed regression and integration testing to identify and log defects early in the development cycle.",
                tech: "Cypress, JavaScript, Chrome DevTools, Postman, JIRA",
              },
            ].map((job, index) => (
              <div
                key={index}
                className="bg-slate-800 text-white rounded-xl p-6 shadow-lg hover:shadow-cyan-400/30 transition-all"
              >
                <h4 className="text-lg font-semibold">
                  {job.title}
                  {job.company && (
                    <>
                      {" "}
                      —{" "}
                      <span className="text-cyan-300 font-medium">
                        {job.company}
                      </span>
                    </>
                  )}
                </h4>
                <p className="text-sm text-slate-400 mb-2">{job.duration}</p>
                <p className="text-sm text-slate-300">{job.description}</p>
                <p className="text-sm text-slate-400 mt-3">
                  <strong className="text-white">Tech:</strong> {job.tech}
                </p>
              </div>
            ))}
          </div>
        </div> */}

        <div className="relative mt-20 border-l-2 border-white pl-8 space-y-16">
          {/* Work Experience Header */}
          <h4 className="text-3xl font-bold text-center text-cyan-400 mb-12">
            🔧 Work Experience
          </h4>

          {/* Full Stack Developer */}
          <div className="relative">
            <div className="absolute -left-[1.15rem] top-1 w-4 h-4 bg-white rounded-full border-2 border-white"></div>
            <h5 className="text-xl font-bold mb-2">🧠 Full Stack Developer — Jai Infoway Pvt. Ltd.</h5>
            <p className="text-sm text-gray-500 mb-4">Nov 2024 – Present</p>
            <p className="text-gray-300">
              As a full stack developer, I led the end-to-end development of web applications, translating product ideas into production-grade features.
              I collaborated with cross-functional teams to design scalable architecture and deliver performant solutions. Emphasis was placed on enhancing platform security, seamless user onboarding, and robust profile management. I also introduced microservice-style modular APIs to enable flexible business logic deployment.
            </p>

            <p className="flex mt-5 items-start text-xl">Key Highlights :</p>

            <ul className="space-y-2 mt-4 pl-6">
              <li className="flex items-start">
                <span className="mt-1 mr-3 text-cyan-400">•</span>
                <span className="text-gray-300 leading-relaxed">
                  Implemented a comprehensive appointment log system to track every change including payments, refunds, date updates, and run modifications.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mt-1 mr-3 text-cyan-400">•</span>
                <span className="text-gray-300 leading-relaxed">
                  Developed Google authentication and email verification during user signup for secure access.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mt-1 mr-3 text-cyan-400">•</span>
                <span className="text-gray-300 leading-relaxed">
                  Built profile upload features for clients and pets, including image cropping and storage in AWS S3 buckets.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mt-1 mr-3 text-cyan-400">•</span>
                <span className="text-gray-300 leading-relaxed">
                  Added employee onboarding flow with invite-based signup and password reset functionality.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mt-1 mr-3 text-cyan-400">•</span>
                <span className="text-gray-300 leading-relaxed">
                  Resolved various UI and backend bugs to improve overall stability and user experience.
                </span>
              </li>
            </ul>

            <p className="text-m text-cyan-400 font-mono mt-5">
              Stack: [Next.js, Node.js, PostgreSQL, Firebase, Google Auth, AWS S3]
            </p>
          </div>

          {/* Mobile App Developer */}
          <div className="relative">
            <div className="absolute -left-[1.15rem] top-1 w-4 h-4 bg-white rounded-full border-2 border-white"></div>
            <h5 className="text-xl font-bold mb-2">📱 Mobile App Developer — Jai Infoway Pvt. Ltd.</h5>
            <p className="text-sm text-gray-500 mb-4">Nov 2022 – Nov 2024</p>
            <p className="text-gray-300">
              Worked on feature-rich mobile apps that required precision UI/UX and platform-specific optimization. I contributed significantly to feature delivery, app reusability, and post-launch iteration based on analytics and user feedback. I also maintained app store compliance and implemented parental controls and in-app purchases for monetization.
            </p>
              <p className="flex mt-5 items-start text-xl">Key Highlights :</p>
            <ul className="space-y-2 mt-4 pl-6">
              <li className="flex items-start">
                <span className="mt-1 mr-3 text-cyan-400">•</span>
                <span className="text-gray-300 leading-relaxed">
                  Delivered high-performance apps with features like reward tracking, dynamic linking, and interactive billing flows.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mt-1 mr-3 text-cyan-400">•</span>
                <span className="text-gray-300 leading-relaxed">
                  Integrated third-party SDKs like Braze, Mixpanel, and Google Maps.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mt-1 mr-3 text-cyan-400">•</span>
                <span className="text-gray-300 leading-relaxed">
                  Improved user acquisition with deep linking and push campaigns.
                </span>
              </li>
            </ul>

            <p className="text-sm text-cyan-400 font-mono mt-5">
              Stack: [React Native, Node.js, MongoDB, AWS, GCP, AppleConnect, Firebase Dynamic Links]
            </p>
          </div>

          {/* Test Automation Engineer */}
          <div className="relative">
            <div className="absolute -left-[1.15rem] top-1 w-4 h-4 bg-white rounded-full border-2 border-white"></div>
            <h5 className="text-xl font-bold mb-2">🧪 Test Automation Engineer — Jai Infoway Pvt. Ltd.</h5>
            <p className="text-sm text-gray-500 mb-4">May 2021 – Nov 2022</p>
            <p className="text-gray-300">
              I started my journey with a strong foundation in QA and automation. My role involved creating automation pipelines to support stable feature releases. I ensured consistent application behavior using integration tests and closely collaborated with devs to enforce test-driven development.
            </p>
              <p className="flex mt-5 items-start text-xl">Key Highlights :</p>
            <ul className="space-y-2 mt-4 pl-6">
              <li className="flex items-start">
                <span className="mt-1 mr-3 text-cyan-400">•</span>
                <span className="text-gray-300 leading-relaxed">
                  Built Cypress test suites integrated into CI/CD.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mt-1 mr-3 text-cyan-400">•</span>
                <span className="text-gray-300 leading-relaxed">
                  Proactively logged regressions and collaborated in sprint retros for improved test coverage.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mt-1 mr-3 text-cyan-400">•</span>
                <span className="text-gray-300 leading-relaxed">
                  Acted as QA lead during staging for finance and trading features.
                </span>
              </li>
            </ul>

            <p className="text-sm text-cyan-400 font-mono mt-5">
              Stack: [Cypress, JavaScript, JIRA, Postman, Chrome DevTools]
            </p>
          </div>
        </div>



        {/* Notable Projects */}
        {/* <div className="mt-16 text-left">
          <h3 className="text-xl font-bold text-pink-400 mb-4">
            Notable Projects
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1e293b] p-4 rounded-lg shadow-md border border-[#334155] hover:shadow-cyan-500/10 transition">
              <h5 className="text-lg font-semibold text-white">AutoFlow</h5>
              <p className="text-sm text-slate-300 mt-1">
                Sales automation platform with multi-source data extraction and
                marketing workflows.
              </p>
              <span className="text-xs text-cyan-400 mt-2 block">
                Next.js • Apollo • TypeScript
              </span>
            </div>

            <div className="bg-[#1e293b] p-4 rounded-lg shadow-md border border-[#334155] hover:shadow-cyan-500/10 transition">
              <h5 className="text-lg font-semibold text-white">
                Earnings Call
              </h5>
              <p className="text-sm text-slate-300 mt-1">
                AI-powered financial analysis platform with LLM integration and
                voice assistant.
              </p>
              <span className="text-xs text-cyan-400 mt-2 block">
                Next.js • AWS • AI Agents
              </span>
            </div>

            <div className="bg-[#1e293b] p-4 rounded-lg shadow-md border border-[#334155] hover:shadow-cyan-500/10 transition">
              <h5 className="text-lg font-semibold text-white">
                OFLEP Connect
              </h5>
              <p className="text-sm text-slate-300 mt-1">
                WebRTC video conferencing with screen sharing and real-time host
                controls.
              </p>
              <span className="text-xs text-cyan-400 mt-2 block">
                React Native • WebRTC • Socket.io
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
