import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#111111", // primary text/buttons (near-black)
          accent: "#16A34A", // success/CTA accent (green-600)
          subtle: "#6B7280", // gray-500 text
          bg: "#F9FAFB", // page background
          card: "#FFFFFF", // card background
          border: "#E5E7EB", // gray-200
          danger: "#DC2626", // red-600
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
      },
      borderRadius: {
      lg: "var(--radius-lg)",
      md: "var(--radius-md)",
      sm: "var(--radius-sm)",
        xl2: "1rem",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
