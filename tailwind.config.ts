import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rosa: {
          DEFAULT: "#FF6B91",
          claro: "#F8E1EC",
          fondo: "#FFF6F9",
        },
        dorado: "#D4AF37",
        ciruela: "#6B486B",
        texto: "#333333",
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
