// tailwind.config.js
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ← FLAT, NOT NESTED
        "arion-body": "#050608",
        "arion-shadow": "#0F141A",
        "arion-rim": "#223445",
        "arion-gold": "#CE9F4F",
        "arion-particle": "#D8A752",
        "arion-text": "#C8A15A",
      },
      backgroundImage: {
        "arion-gradient": "linear-gradient(180deg, #0A1A28, #0D0F12)",
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;