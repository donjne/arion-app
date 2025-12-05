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
          body: "#050608",
          shadow: "#0F141A",
          rim: "#223445",
          gold: "#CE9F4F",
          "bg-top": "#0A1A28",
          "bg-bottom": "#0D0F12",
          particle: "#D8A752",
          text: "#C8A15A",
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