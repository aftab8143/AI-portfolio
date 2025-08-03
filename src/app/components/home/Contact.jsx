"use client";

import { motion } from "framer-motion";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Contact() {
  const contactItems = [
    {
      icon: <FaEnvelope size={20} />,
      text: "aftab8143@gmail.com",
      href: "mailto:aftab8143@gmail.com",
    },
    {
      icon: <FaGithub size={20} />,
      text: "Aftab8143",
      href: "https://github.com/aftab8143",
    },
    {
      icon: <FaLinkedin size={20} />,
      text: "Aftab Alam",
      href: "https://www.linkedin.com/in/aftab8143/",
    },
  ];

  return (
    <section className="py-20 px-6 text-white bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-pink-400 mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Contact Me
        </motion.h2>

        <motion.p
          className="text-slate-400 text-base md:text-lg mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Let’s connect — I’m open to freelance, full-time roles, or
          collaborations!
        </motion.p>

        <motion.div
          className="grid sm:grid-cols-3 gap-6 justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {contactItems.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center flex-col bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-xl shadow hover:shadow-pink-500/30 hover:scale-105 transition-all duration-300 gap-2 text-slate-300 hover:text-white"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="text-pink-400">{item.icon}</div>
              <span className="text-sm break-words text-center">
                {item.text}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
