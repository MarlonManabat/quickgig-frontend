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
          DEFAULT: '#111827', // text
          bg: '#ffffff', // background
          surface: '#f9fafb', // cards
          accent: '#2563eb', // CTA / primary
          'accent-hover': '#1e40af',
          border: '#e5e7eb',
          subtle: '#6b7280', // metadata/muted
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6',
          /**
           * Unified theme tokens
           */
          primary: '#0ea5a3',
          muted: '#475569',
          foreground: '#0f172a',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--surface-muted)',
          base: '#ffffff',
          raised: '#f9fafb',
        },
        text: 'var(--text)',
        header: {
          bg: 'var(--header-bg)',
          text: 'var(--header-text)',
        },
        link: 'var(--link)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        soft: '0 8px 24px rgba(0,0,0,.08)',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xl: '1rem',
        '2xl': '1.25rem',
        xl2: '1rem',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
export default config;
