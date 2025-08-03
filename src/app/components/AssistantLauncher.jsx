"use client";

import { useState, useEffect } from "react";
import Assistant from "./assitant";
import { AnimatePresence, motion } from "framer-motion";
import { ChatBotIcon } from "./ChatIcon";

export default function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const hasSeenInfo = localStorage.getItem("hasSeenEVAInfo");
    if (!hasSeenInfo) {
      setShowInfo(true);
      setTimeout(() => {
        setShowInfo(false);
        localStorage.setItem("hasSeenEVAInfo", "true");
      }, 20000);
    }
  }, []);

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-[999] flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        {/* Tooltip */}
 {showInfo && (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="relative bg-black text-white text-sm rounded px-3 py-2 shadow-lg max-w-xs"
  >
    Ask EVA anything<br />
    about Aftab’s portfolio

    {/* Arrow pointing to icon */}
    <div
      style={{
        content: "''",
        position: "absolute",
        right: "-10px",
        top: "50%",
        transform: "translateY(-50%)",
        width: 0,
        height: 0,
        borderTop: "8px solid transparent",
        borderBottom: "8px solid transparent",
        borderLeft: "10px solid black",
      }}
    />
  </motion.div>
)}



        {/* Chat icon */}
        <motion.div
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer relative"
        >
          <ChatBotIcon />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {open && <Assistant onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
