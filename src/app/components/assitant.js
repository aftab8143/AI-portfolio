"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { ChatBotIcon } from "./ChatIcon";
import { UserIcon, X } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";

export default function Assistant({ onClose }) {
  const { theme } = useContext(ThemeContext);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleAsk = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.text }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        result += chunk;

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return [...prev.slice(0, -1), { role: "assistant", text: result }];
          } else {
            return [...prev, { role: "assistant", text: result }];
          }
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-xl p-6 w-full max-w-2xl max-h-[75vh] flex flex-col border border-[var(--line)] bg-[var(--surface)]"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold [color:var(--accent)]">
            Chat with EVA
          </h3>

          <X
            onClick={onClose}
            className="text-lg cursor-pointer hover:[color:var(--accent)] [color:var(--text-light)]"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4 model-content">
          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} i={i} theme={theme} />
          ))}
          {loading && (
            <motion.p
              className="italic [color:var(--text-muted)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              EVA is typing...
            </motion.p>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="flex items-center rounded-full px-3 py-2 gap-2 bg-[var(--bg-dark)] border border-[var(--line)]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Ask something..."
            className="flex-1 bg-transparent text-sm outline-none [color:var(--text-light)]"
          />
          <button
            onClick={handleAsk}
            className="px-3 py-1 rounded-full shadow text-white [background:var(--accent)] hover:[background:var(--btn-hover)]"
          >
            <FaPaperPlane />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ChatMessage({ msg, i, theme }) {
  const isUser = msg.role === "user";

  return (
    <div
      key={i}
      className={`flex items-start space-x-2 ${
        isUser ? "justify-end space-x-reverse" : "justify-start"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? null : <ChatBotIcon size={32} />}
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-[75%] px-4 py-3 text-sm leading-snug rounded-2xl ${
          isUser ? "text-white [background:var(--accent)]" : "bg-[var(--surface-hover)] [color:var(--text-light)]"
        }`}
      >
        {/* Content */}
        {isUser ? (
          <span>{msg.text}</span>
        ) : (
          <div className="flex items-start space-x-2">
            {/* Wrap markdown in a styled div instead */}
            <div className={`prose prose-sm ${theme === "dark" ? "prose-invert" : ""}`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
