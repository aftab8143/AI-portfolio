"use client";

import { useState, useEffect } from "react";
import Assistant from "./assitant";
import { AnimatePresence, motion } from "framer-motion";
import { ChatBotIcon } from "./ChatIcon";
import { useEvaStore } from "@/app/store/useEvaStore";

export default function AssistantLauncher() {
  // Open state lives in the store so the conversation and panel survive page changes
  const open = useEvaStore((s) => s.open);
  const setOpen = useEvaStore((s) => s.setOpen);
  const toggle = useEvaStore((s) => s.toggle);
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
        className={`fixed bottom-4 right-4 z-[999] flex items-center gap-2 ${open ? "max-sm:hidden" : ""}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {showInfo && !open && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="eva-tip glass relative max-w-xs !rounded-2xl px-4 py-2.5 max-sm:hidden"
            >
              <p className="flex items-center gap-2 text-[13.5px] font-semibold text-hi">
                <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" aria-hidden="true" />
                Ask EVA anything
              </p>
              <p className="mt-0.5 text-[12.5px] text-mid">about Aftab&apos;s work &amp; experience</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launcher */}
        <motion.button
          type="button"
          onClick={toggle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label={open ? "Close chat with EVA" : "Chat with EVA, Aftab's portfolio assistant"}
          aria-expanded={open}
          data-cursor="Chat"
          className="eva-launcher relative grid h-[60px] w-[60px] place-items-center rounded-full"
        >
          <span className="eva-halo" aria-hidden="true" />
          <ChatBotIcon size={60} />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {open && <Assistant onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
