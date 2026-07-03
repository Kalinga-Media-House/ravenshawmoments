import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ravenshaw: {
          800: '#8a2727',
          900: '#752222',
          300: '#f3b0b0',
        },
      },
    },
  },
  plugins: [],
};
export default config;