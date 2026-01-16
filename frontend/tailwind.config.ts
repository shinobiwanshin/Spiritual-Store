import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#a67a3f",
        "background-light": "#fcfbf7",
        "background-dark": "#1b1a18",
        "spiritual-blue": "#2E3A6D",
        terracotta: "#b35a38",
        sapphire: "#2E3A6D",
        saffron: "#FF9933",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
export default config;
