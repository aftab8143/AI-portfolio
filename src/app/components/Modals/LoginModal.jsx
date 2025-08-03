"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill all fields.");
    } else if (!email.includes("@")) {
      setError("Invalid email format.");
    } else if (email === "aftab8143@gmail.com" && password === "123") {
      localStorage.setItem("isLoggedIn", "true");
      onSuccess();
    } else {
      setError("Incorrect credentials.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-sm bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white p-6 rounded-2xl shadow-xl border border-white/10"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-slate-400 hover:text-white text-xl"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">
          Sign In to Write
        </h2>

        {error && (
          <p className="text-sm text-red-400 mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0f172a] font-semibold py-2 rounded-full transition duration-200 shadow-md"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}
