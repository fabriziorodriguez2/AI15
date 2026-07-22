import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rosa: {
          DEFAULT: "#CD5782",
          claro: "#F0EEF3",
          fondo: "#FAF8FA",
        },
        dorado: "#CDAF6B",
        mist: "#C7DAD8",
        ciruela: "#2F3332",
        texto: "#2F3332",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(75, 51, 75, 0.05)",
        soft: "0 1px 3px rgba(75, 51, 75, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
