import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          black: "#050505",
          red: "#E50914",
          blue: "#00D1FF",
          panel: "rgba(18, 18, 20, 0.68)"
        }
      },
      boxShadow: {
        neon: "0 0 36px rgba(0, 209, 255, 0.22)",
        redglow: "0 0 34px rgba(229, 9, 20, 0.28)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
