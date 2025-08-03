'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ScrollStoryMini() {
  const [hoverKey, setHoverKey] = useState(0);

  return (
    <motion.div
      onMouseEnter={() => setHoverKey(prev => prev + 1)}
      whileHover={{ scale: 1.015 }}
      className="relative w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-700 to-pink-600 p-6 overflow-hidden text-white shadow-2xl border border-white/10 cursor-pointer group transition-all duration-300"
    >
      {/* Glow outline on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-pink-400/50 pointer-events-none transition-all duration-300"
      />

      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-lg animate-[shimmer_2.5s_linear_infinite]"
        style={{
          backgroundSize: '200% 100%',
          backgroundPosition: '200% 0%',
        }}
      />

      {/* Background glow */}
      <div className="absolute -top-10 left-1/2 w-72 h-72 bg-pink-400/30 rounded-full blur-[100px] opacity-20 -translate-x-1/2 pointer-events-none" />

      {/* Animated content */}
      <AnimatedContent key={hoverKey} />
    </motion.div>
  );
}

function AnimatedContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative z-10 flex flex-col justify-center items-center text-center h-full"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-2xl font-bold tracking-tight drop-shadow-md"
      >
        Scroll Story
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-2 text-sm text-white/80 max-w-xs"
      >
        Scroll-activated storytelling interactions with Framer Motion.
      </motion.p>
    </motion.div>
  );
}
