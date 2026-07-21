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
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 8px 24px -12px rgba(107, 72, 107, 0.18)",
        soft: "0 2px 12px -6px rgba(107, 72, 107, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
