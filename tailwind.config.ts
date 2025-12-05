import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'arion': {
          'body': '#050608',        // Deep midnight black
          'shadow': '#0F141A',      // Charcoal navy-black
          'rim': '#223445',         // Faint cool steel
          'gold': '#CE9F4F',        // Divine gold
          'bg-top': '#0A1A28',      // Deep blue-black
          'bg-bottom': '#0D0F12',   // Charcoal dusk
          'particle': '#D8A752',    // Warm sparkle gold
          'text': '#C8A15A',        // Premium inscription gold
        }
      },
      fontFamily: {
        'arion': ['Cinzel', 'serif'],  // Elegant, Roman-style font
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;