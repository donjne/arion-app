import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arion: {
          body: "var(--arion-body)",
          shadow: "var(--arion-shadow)",
          rim: "var(--arion-rim)",
          gold: "var(--arion-gold)",
          "bg-top": "var(--arion-bg-top)",
          "bg-bottom": "var(--arion-bg-bottom)",
          particle: "var(--arion-particle)",
          text: "var(--arion-text)",
        },
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