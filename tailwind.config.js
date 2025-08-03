module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#00f7ff", // 💡 match your :root --accent value
        "bg-dark": "#0f172a",
        "text-light": "#f1f5f9",
        "btn-hover": "#0ea5e9",
      },

      animation: {
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0%" },
          "100%": { backgroundPosition: "-200% 0%" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
