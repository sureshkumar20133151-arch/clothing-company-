import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: "#f0f4f9",
          100: "#d9e2f0",
          200: "#b3c6e1",
          300: "#80a2cd",
          400: "#4d7eb8",
          500: "#2a5f9e",
          600: "#1e477a",
          700: "#1a3962",
          800: "#1a2a4b",
          900: "#0f1b33",
          950: "#09101f",
        },
        kora: {
          50: "#fdfcfb",
          100: "#faf8f5",
          200: "#f4f1ea",
          300: "#ece6dc",
          400: "#dcd2c3",
          500: "#c7b8a3",
          600: "#a99881",
        },
        terracotta: {
          500: "#b3543b",
          600: "#933d28",
        },
        ochre: {
          500: "#d49b27",
          600: "#b27f1c",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
