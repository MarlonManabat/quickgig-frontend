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
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Apple Color Emoji',
          'Segoe UI Emoji',
        ],
        heading: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      fontSize: {
        xs: ['clamp(0.75rem, 0.73rem + 0.10vw, 0.78rem)', '1.2'],
        sm: ['clamp(0.875rem,0.85rem + 0.10vw, 0.92rem)', '1.45'],
        base: ['clamp(1.00rem,0.96rem + 0.20vw, 1.06rem)', '1.6'],
        lg: ['clamp(1.125rem,1.08rem + 0.25vw,1.25rem)', '1.45'],
        xl: ['clamp(1.25rem, 1.18rem + 0.30vw, 1.50rem)', '1.35'],
        '2xl': ['clamp(1.50rem, 1.40rem + 0.50vw, 1.875rem)', '1.25'],
        '3xl': ['clamp(1.875rem,1.70rem + 0.80vw, 2.25rem)', '1.2'],
        '4xl': ['clamp(2.25rem, 2.00rem + 1.00vw, 3.00rem)', '1.1'],
      },
    },
  },
  plugins: [],
};
export default config;
