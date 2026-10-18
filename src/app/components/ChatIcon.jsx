"use client";

import { useId } from "react";

// EVA's face: a night-black orb in a gold ring, with blinking gold eyes and a
// twinkling sparkle. `size` scales everything; small sizes (chat avatars)
// drop the sparkle so it stays readable.
export const ChatBotIcon = ({ size = 60 }) => {
  // Unique gradient ids: several icons can be on the page at once
  const id = useId().replace(/:/g, "");
  const ring = `eva-ring-${id}`;
  const face = `eva-face-${id}`;
  const glow = `eva-glow-${id}`;
  const small = size < 44;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={ring} x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f2da8c" />
          <stop offset="0.55" stopColor="#c9a24b" />
          <stop offset="1" stopColor="#8a6d1f" />
        </linearGradient>
        <radialGradient id={face} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#26231c" />
          <stop offset="1" stopColor="#0b0b0d" />
        </radialGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f2da8c" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f2da8c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Gold ring + dark face */}
      <circle cx="32" cy="32" r="30" fill={`url(#${ring})`} />
      <circle cx="32" cy="32" r="27" fill={`url(#${face})`} />

      {/* Eyes (blink every few seconds) */}
      <g fill="#f2da8c">
        <rect x="20" y="25" width="7" height="11" rx="3.5">
          <animate attributeName="height" values="11;11;1.5;11;11" keyTimes="0;0.88;0.92;0.96;1" dur="4.2s" repeatCount="indefinite" />
          <animate attributeName="y" values="25;25;29.75;25;25" keyTimes="0;0.88;0.92;0.96;1" dur="4.2s" repeatCount="indefinite" />
        </rect>
        <rect x="37" y="25" width="7" height="11" rx="3.5">
          <animate attributeName="height" values="11;11;1.5;11;11" keyTimes="0;0.88;0.92;0.96;1" dur="4.2s" repeatCount="indefinite" />
          <animate attributeName="y" values="25;25;29.75;25;25" keyTimes="0;0.88;0.92;0.96;1" dur="4.2s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Smile */}
      <path d="M25 42.5 Q32 47.5 39 42.5" stroke="#c9a24b" strokeWidth="2.6" strokeLinecap="round" />

      {/* Twinkling sparkle */}
      {!small && (
        <g transform="translate(47 14)">
          <circle r="7" fill={`url(#${glow})`} />
          <path d="M0 -6 C0.8 -1.6 1.6 -0.8 6 0 C1.6 0.8 0.8 1.6 0 6 C-0.8 1.6 -1.6 0.8 -6 0 C-1.6 -0.8 -0.8 -1.6 0 -6Z" fill="#fff1c9">
            <animateTransform attributeName="transform" type="scale" values="0.7;1.05;0.7" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" />
          </path>
        </g>
      )}
    </svg>
  );
};
