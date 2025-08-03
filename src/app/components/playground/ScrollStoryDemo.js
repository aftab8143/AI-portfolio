"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import ParticlesBackground from "@/app/components/ParticlesBackground";

export default function ScrollStoryDemo() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [activeSection, setActiveSection] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.2) setActiveSection(0);
    else if (latest < 0.45) setActiveSection(1);
    else if (latest < 0.75) setActiveSection(2);
    else setActiveSection(3);

    setShowBackToTop(latest > 0.3);
  });

  const scrollToSection = (index) => {
    const section = document.getElementById(`section-${index}`);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <ParticlesBackground />

      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500"
          >
            ScrollMagic
          </motion.div>

          <div className="hidden md:flex gap-6">
            {["Hero", "Features", "Animation", "Get Started"].map(
              (label, index) => (
                <motion.button
                  key={index}
                  onClick={() => scrollToSection(index)}
                  animate={{
                    color: activeSection === index ? "#34d399" : "#ffffff",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm font-medium transition-all"
                >
                  {label}
                </motion.button>
              )
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-lg text-sm font-semibold shadow-lg"
          >
            Try Demo
          </motion.button>
        </div>
      </motion.nav>

      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500 origin-left z-40"
      />

      {/* Percentage indicator */}
      <motion.div
        style={{
          x: useTransform(scrollYProgress, [0, 1], ["0%", "calc(100% - 40px)"]),
          opacity: useTransform(
            scrollYProgress,
            [0, 0.05, 0.95, 1],
            [0, 1, 1, 0]
          ),
        }}
        className="fixed top-20 text-xs z-40 px-3 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full border border-white/10"
      >
        <motion.span>{percentage.get().toFixed(0)}%</motion.span>
      </motion.div>

      {/* Mobile menu button */}
      {isMobile && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="fixed right-4 top-4 z-50 md:hidden p-2 rounded-full bg-gray-800/80 backdrop-blur-sm border border-white/10"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 6H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}

      {/* Scroll section indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 space-y-4 hidden md:block"
      >
        {["Hero", "Features", "Animation", "Get Started"].map(
          (label, index) => (
            <motion.button
              key={index}
              onClick={() => scrollToSection(index)}
              animate={{
                scale: activeSection === index ? 1.3 : 1,
                backgroundColor:
                  activeSection === index
                    ? "rgba(52, 211, 153, 0.2)"
                    : "rgba(255, 255, 255, 0.05)",
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeSection === index ? "ring-2 ring-emerald-400" : ""
              }`}
            >
              <motion.span
                className="absolute left-6 whitespace-nowrap text-xs opacity-0"
                animate={{
                  opacity: activeSection === index ? 1 : 0,
                  x: activeSection === index ? 10 : 0,
                }}
              >
                {label}
              </motion.span>
            </motion.button>
          )
        )}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 2,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2,
        }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm text-white/60 mb-2">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-white/80 rounded-full mt-1"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => scrollToSection(0)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed right-6 bottom-6 z-40 p-3 bg-gray-800/80 backdrop-blur-sm border border-white/10 rounded-full shadow-lg"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 19V5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12L12 5L19 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Decorative Glows */}
      <div className="fixed top-[20%] left-[10%] w-72 h-72 bg-emerald-400/10 rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-[10%] right-[15%] w-60 h-60 bg-cyan-400/10 rounded-full blur-[80px] opacity-20 pointer-events-none" />
      <div className="fixed top-[50%] left-[50%] w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] opacity-10 pointer-events-none" />

      {/* Main content container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto scroll-smooth"
      >
        <ScrollContent />
      </div>
    </div>
  );
}

function ScrollContent() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const carouselRef = useRef(null);

  const inView1 = useInView(ref1, { amount: 0.5, once: true });
  const inView2 = useInView(ref2, { amount: 0.5, once: true });
  const inView3 = useInView(ref3, { amount: 0.5, once: true });

  const { scrollYProgress } = useScroll(); // ✅ Global scroll listener
  const [carouselWidth, setCarouselWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      const totalScroll =
        carouselRef.current.scrollWidth -
        carouselRef.current.parentElement.offsetWidth;
      setCarouselWidth(-totalScroll); // ❗ scroll left = negative x
    }
  }, []);

  const xTransform = useTransform(
    scrollYProgress,
    [0.2, 0.45],
    [0, carouselWidth]
  );

  const stats = [
    { value: 100, label: "Components" },
    { value: 24, label: "Animations" },
    { value: 5, label: "Sections" },
  ];

  return (
    <div className="space-y-0 pt-20 pb-40 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section 1: Hero */}
      <section
        id="section-0"
        ref={ref1}
        className="min-h-screen flex flex-col justify-center items-center text-center space-y-8 px-4 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-6 relative z-10"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={inView1 ? { scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-400/30 rounded-full text-emerald-400 text-sm mb-4"
          >
            Framer Motion + Next.js
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={inView1 ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500"
          >
            Scroll-Driven Magic
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={inView1 ? { width: "100%" } : {}}
            transition={{ delay: 0.4, duration: 1 }}
            className="h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-full mx-auto max-w-md"
          />

          <motion.p
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={inView1 ? { opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg sm:text-xl max-w-3xl text-gray-300 leading-relaxed"
          >
            Experience the power of scroll-triggered animations with this
            interactive demo built using React and Framer Motion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView1 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            {stats.map((stat, index) => (
              <StatCounter
                key={index}
                value={stat.value}
                label={stat.label}
                delay={0.8 + index * 0.2}
                inView={inView1}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: Features Carousel */}
      <section
        id="section-1"
        className="min-h-[150vh] flex flex-col justify-center relative"
      >
        <div className="absolute top-1/4 left-0 right-0 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
          >
            Interactive Features
          </motion.h2>
        </div>

        <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden mt-20">
          <motion.div
            ref={carouselRef}
            className="flex space-x-6 w-max px-4 sm:px-10 items-center"
            style={{ x: xTransform }}
          >
            {[
              {
                icon: "🔄",
                title: "Scroll Sync",
                desc: "Horizontal carousel that moves with vertical scroll",
              },
              {
                icon: "✨",
                title: "Animated Indicators",
                desc: "Dynamic dots that show current section",
              },
              {
                icon: "📊",
                title: "Progress Tracking",
                desc: "Real-time scroll percentage indicator",
              },
              {
                icon: "🎚️",
                title: "Motion Controls",
                whileHover: { scale: 1.05, rotate: 2 },
                desc: "Interactive elements with hover effects",
              },
              {
                icon: "📱",
                title: "Responsive Design",
                desc: "Works flawlessly on all device sizes",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-[80vw] sm:w-[400px] shrink-0 bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-lg hover:border-emerald-400/30 transition-all duration-300"
                whileHover={feature.whileHover || { scale: 1.02 }}
              >
                <div className="h-12 w-12 mb-4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center text-xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 3: Animation Showcase */}
      <section
        id="section-2"
        ref={ref2}
        className="min-h-screen flex justify-center items-center px-4 relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={inView2 ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-gradient-to-br from-indigo-600/90 to-purple-700/90 p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-sm border border-white/10 text-center max-w-2xl w-full hover:shadow-[0_20px_50px_rgba(124,58,237,0.4)] transition-all duration-500"
        >
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center text-2xl font-bold">
            ✨
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            Animation Showcase
          </h2>
          <p className="text-white/80 text-sm sm:text-base mb-6">
            Experience the full potential of Framer Motion with these advanced
            animation techniques.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <AnimationExample type="spring" />
            <AnimationExample type="tween" />
            <AnimationExample type="inertia" />
            <AnimationExample type="keyframes" />
          </div>

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="w-full h-2 bg-gradient-to-r from-emerald-400/30 via-cyan-400/30 to-blue-500/30 rounded-full overflow-hidden"
          >
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="h-full w-1/2 bg-gradient-to-r from-emerald-400 to-cyan-500"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Section 4: Final CTA */}
      <section
        id="section-3"
        ref={ref3}
        className="min-h-screen flex justify-center items-center px-4 relative"
      >
        <motion.div
          initial={{ x: "-100vw", opacity: 0 }}
          animate={inView3 ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, type: "spring" }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl max-w-2xl w-full backdrop-blur-lg hover:backdrop-blur-xl transition-all duration-500"
        >
          <h3 className="text-2xl font-bold mb-4 text-white">
            Ready to Build Your Own?
          </h3>
          <p className="text-white/80 text-sm sm:text-base mb-6">
            This demo showcases just a fraction of what's possible with modern
            web animation libraries. The entire codebase is available for you to
            explore and learn from.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(34,211,238,0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl font-semibold text-white shadow-md text-center"
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </motion.a>
            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(124,58,237,0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-white shadow-md text-center"
              href="#section-0"
            >
              Back to Top
            </motion.a>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-sm font-semibold mb-3 text-white/70">
              Tech Stack:
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Next.js",
                "Framer Motion",
                "Tailwind CSS",
                "React Icons",
                "TypeScript",
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  className="px-3 py-1 bg-white/5 rounded-full text-xs border border-white/10"
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function StatCounter({ value, label, delay, inView }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, {
        duration: 2,
        delay: delay,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [inView]);

  return (
    <motion.div className="text-center min-w-[100px]">
      <motion.div className="text-3xl font-bold text-emerald-400">
        {rounded}
      </motion.div>
      <div className="text-sm text-white/60">{label}</div>
    </motion.div>
  );
}

function AnimationExample({ type }) {
  const [isActive, setIsActive] = useState(false);

  const animationProps = {
    spring: {
      animate: {
        scale: isActive ? 1.2 : 1,
        backgroundColor: isActive ? "#34d399" : "#3b82f6",
      },
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    tween: {
      animate: {
        x: isActive ? 20 : 0,
        rotate: isActive ? 10 : 0,
      },
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    inertia: {
      animate: {
        y: isActive ? -20 : 0,
        backgroundColor: isActive ? "#a855f7" : "#3b82f6",
      },
      transition: { type: "inertia", velocity: 50 },
    },
    keyframes: {
      animate: {
        scale: isActive ? [1, 1.2, 0.9, 1.1, 1] : 1,
        backgroundColor: isActive
          ? ["#3b82f6", "#34d399", "#a855f7", "#3b82f6"]
          : "#3b82f6",
      },
      transition: { duration: 1.5 },
    },
  };

  return (
    <motion.div
      onClick={() => setIsActive(!isActive)}
      className="p-4 rounded-lg bg-blue-500/20 border border-white/10 cursor-pointer flex flex-col items-center"
      {...animationProps[type]}
    >
      <div className="w-12 h-12 mb-2 rounded-md bg-white/20 flex items-center justify-center">
        <motion.div
          className="w-6 h-6 rounded bg-white"
          {...animationProps[type]}
        />
      </div>
      <span className="text-xs font-medium capitalize">{type}</span>
    </motion.div>
  );
}
