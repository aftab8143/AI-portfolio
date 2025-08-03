"use client";

import { motion } from "framer-motion";

export function Loader({ className = "" }) {
  return (
    <motion.div
      className={`relative w-12 h-12 ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <motion.div
        className="absolute w-4 h-4 bg-emerald-400 rounded-full top-0 left-0"
        animate={{
          scale: [1, 0.5, 1],
          boxShadow: [
            "0 0 0 rgba(52, 211, 153, 0)",
            "0 0 10px rgba(52, 211, 153, 0.5)",
            "0 0 0 rgba(52, 211, 153, 0)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 0,
          times: [0, 0.5, 1],
        }}
      />
      <motion.div
        className="absolute w-4 h-4 bg-cyan-400 rounded-full top-0 right-0"
        animate={{
          scale: [0.5, 1, 0.5],
          boxShadow: [
            "0 0 0 rgba(34, 211, 238, 0)",
            "0 0 10px rgba(34, 211, 238, 0.5)",
            "0 0 0 rgba(34, 211, 238, 0)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 0,
          times: [0, 0.5, 1],
        }}
      />
      <motion.div
        className="absolute w-4 h-4 bg-blue-400 rounded-full bottom-0 right-0"
        animate={{
          scale: [1, 0.5, 1],
          boxShadow: [
            "0 0 0 rgba(59, 130, 246, 0)",
            "0 0 10px rgba(59, 130, 246, 0.5)",
            "0 0 0 rgba(59, 130, 246, 0)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 0,
          times: [0, 0.5, 1],
        }}
      />
      <motion.div
        className="absolute w-4 h-4 bg-purple-400 rounded-full bottom-0 left-0"
        animate={{
          scale: [0.5, 1, 0.5],
          boxShadow: [
            "0 0 0 rgba(168, 85, 247, 0)",
            "0 0 10px rgba(168, 85, 247, 0.5)",
            "0 0 0 rgba(168, 85, 247, 0)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 0,
          times: [0, 0.5, 1],
        }}
      />
    </motion.div>
  );
}
