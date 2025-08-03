export const ChatBotIcon = ({ size = 64, color = "#3B82F6" }) => (
  <div className="group rounded-xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20">
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="12"
        fill="url(#bgGradient)"
      />
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="12"
        stroke="url(#borderGradient)"
        strokeWidth="2"
        className="transition-all group-hover:stroke-cyan-400 group-hover:drop-shadow-[0_0_6px_cyan]"
      />

      {/* Robot head - positioned lower to make room for speech bubble */}
      <g transform="translate(12, 14)">
        {/* Changed from 16 to 20 */}
        {/* Head with 3D effect */}
        <path d="M8 8H32V32H24L20 36V32H8V8Z" fill="white" />
        <rect
          x="8"
          y="8"
          width="24"
          height="24"
          rx="8"
          fill="url(#headGradient)"
        />
        {/* Eyes */}
        <rect
          x="12"
          y="16"
          width="16"
          height="4"
          rx="2"
          fill="#1E293B"
          opacity="0.2"
        />
        <rect x="12" y="16" width="16" height="4" rx="2" fill="#1E293B">
          <animate
            attributeName="width"
            values="0;16;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
        {/* Mouth */}
        <path
          d="M16 26 Q20 30 24 26"
          stroke="#1E293B"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        >
          {/* <animate
          attributeName="d"
          values="M16 26 Q20 30 24 26; M16 26 Q20 22 24 26; M16 26 Q20 30 24 26"
          dur="4s"
          repeatCount="indefinite"
        /> */}
        </path>
        {/* Antenna - now fully visible */}
        <circle cx="20" cy="4" r="2" fill={color}>
          {" "}
          {/* Adjusted position */}
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <line
          x1="20"
          y1="6"
          x2="20"
          y2="10"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Adjusted position */}
      </g>

      {/* Speech bubble - moved up and to the right */}
      <g transform="translate(38, 6)">
        {/* Changed from 36,8 */}
        <path
          d="M16 6H4C1.79086 6 0 7.79086 0 10V16C0 18.2091 1.79086 20 4 20H12L16 24V20H20C22.2091 20 24 18.2091 24 16V10C24 7.79086 22.2091 6 20 6H16Z"
          fill="#C2185B"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -2; 0 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <text
          x="12"
          y="14"
          textAnchor="middle"
          fill="white"
          fontSize="6"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          HI!
        </text>
      </g>

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="64">
          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>

        <linearGradient id="borderGradient" x1="0" y1="0" x2="0" y2="64">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="headGradient" x1="0" y1="0" x2="0" y2="32">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);
