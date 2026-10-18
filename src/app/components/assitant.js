"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ArrowUp, RotateCcw, X } from "lucide-react";
import { ChatBotIcon } from "./ChatIcon";
import { ThemeContext } from "@/context/ThemeContext";
import { useEvaStore } from "@/app/store/useEvaStore";

// How many earlier messages go with each question, so follow-ups make sense
const HISTORY_TURNS = 10;

const STARTERS = [
  "What is Aftab working on right now?",
  "Tell me about his AI work",
  "Which mobile apps has he shipped?",
];

// Some models stream their reasoning in <think> tags — never show that
const stripThinking = (text) =>
  text.replace(/<think>[\s\S]*?(<\/think>|$)/g, "").trimStart();

export default function Assistant({ onClose }) {
  const { theme } = useContext(ThemeContext);
  const { messages, addMessage, updateLastAssistant, reset } = useEvaStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const ask = async (text) => {
    const question = text.trim();
    if (!question || loading) return;

    // The conversation so far (before this question) gives EVA context
    const history = useEvaStore
      .getState()
      .messages.slice(-HISTORY_TURNS)
      .map((m) => ({ role: m.role, content: m.text }));

    addMessage({ role: "user", text: question });
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "EVA couldn't answer right now. Please try again in a moment.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let raw = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        const visible = stripThinking(raw);
        if (visible) updateLastAssistant(visible);
      }
      if (!stripThinking(raw)) updateLastAssistant("Sorry, I didn't catch that — could you ask again?");
    } catch (err) {
      addMessage({ role: "assistant", text: err.message || "Something went wrong. Try again!" });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  // Keep the newest message in view
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Focus the input on open; Escape closes
  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const lastIsAssistant = messages[messages.length - 1]?.role === "assistant";

  return (
    <motion.div
      role="dialog"
      aria-label="Chat with EVA"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "bottom right" }}
      className="eva-panel fixed inset-0 z-[1000] flex flex-col overflow-hidden bg-[var(--bg-1)] sm:inset-auto sm:bottom-[92px] sm:right-4 sm:h-[min(620px,calc(100svh-120px))] sm:w-[390px] sm:rounded-3xl"
    >
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <ChatBotIcon size={38} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-semibold leading-tight text-hi">EVA</p>
          <p className="flex items-center gap-1.5 text-[12px] text-lo">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
            Portfolio assistant
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={reset}
            disabled={loading}
            className="flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-[12px] text-mid transition-colors hover:text-hi disabled:opacity-50"
          >
            <RotateCcw size={13} /> New chat
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="grid h-9 w-9 place-items-center rounded-full text-mid transition-colors hover:bg-white/5 hover:text-hi"
        >
          <X size={18} />
        </button>
      </header>

      {/* Messages */}
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col justify-end">
            <div className="flex items-start gap-2.5">
              <ChatBotIcon size={30} />
              <div className="eva-bubble-bot max-w-[85%] rounded-2xl rounded-tl-md px-4 py-3 text-[14px] leading-relaxed">
                Hi! I&apos;m <b className="text-hi">EVA</b>. Ask me anything about Aftab — his projects, experience,
                skills or how to get in touch.
              </div>
            </div>
            <div className="mt-4 flex flex-col items-end gap-2">
              {STARTERS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => ask(q)}
                  className="rounded-full border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] px-3.5 py-1.5 text-[13px] text-accent-ink transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => <ChatMessage key={i} msg={msg} theme={theme} />)
        )}

        {loading && !lastIsAssistant && (
          <div className="flex items-start gap-2.5">
            <ChatBotIcon size={30} />
            <div className="eva-bubble-bot flex items-center gap-1.5 rounded-2xl rounded-tl-md px-4 py-3.5" aria-label="EVA is typing">
              <span className="eva-dot" />
              <span className="eva-dot" style={{ animationDelay: "0.15s" }} />
              <span className="eva-dot" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="border-t border-line p-3"
      >
        <div className="flex items-center gap-2 rounded-2xl border border-line bg-[var(--bg-0)] py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-[var(--accent)]">
          <input
            ref={inputRef}
            type="text"
            value={input}
            maxLength={500}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask EVA about Aftab…"
            className="flex-1 bg-transparent py-1.5 text-[14px] text-hi outline-none placeholder:text-lo"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send"
            className="grid h-9 w-9 place-items-center rounded-xl text-[var(--on-accent)] transition-opacity disabled:opacity-40"
            style={{ background: "var(--grad)" }}
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-lo">EVA can make mistakes — check important details with Aftab.</p>
      </form>
    </motion.div>
  );
}

function ChatMessage({ msg, theme }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="eva-bubble-user max-w-[85%] rounded-2xl rounded-tr-md px-4 py-2.5 text-[14px] leading-relaxed">
          {msg.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <ChatBotIcon size={30} />
      <div className="eva-bubble-bot max-w-[85%] rounded-2xl rounded-tl-md px-4 py-3 text-[14px] leading-relaxed">
        <div className={`eva-md prose prose-sm max-w-none ${theme === "dark" ? "prose-invert" : ""}`}>
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
