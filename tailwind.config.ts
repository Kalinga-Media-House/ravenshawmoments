import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],

  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        ravenshaw: {
          300: "#f3b0b0",
          800: "#8a2727",
          900: "#752222",
        },
      },
    },
  },

  plugins: [animate],
};

export default config;