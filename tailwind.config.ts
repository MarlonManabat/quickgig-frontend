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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // QuickGig Brand Colors
        qg: {
          primary: {
            DEFAULT: '#00B272',
            light: '#00D085',
            dark: '#009960',
            hover: '#00A066',
          },
          accent: {
            DEFAULT: '#FFD447',
            light: '#FFF066',
            dark: '#E6BF3D',
            hover: '#F5C842',
          },
          navy: {
            DEFAULT: '#002C3E',
            light: '#003D52',
            dark: '#001A26',
          },
          white: '#FFFFFF',
        },
        // Semantic colors using QuickGig palette
        success: '#00B272',
        warning: '#FFD447',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        'qg-xs': '0.75rem',
        'qg-sm': '0.875rem',
        'qg-base': '1rem',
        'qg-lg': '1.125rem',
        'qg-xl': '1.25rem',
        'qg-2xl': '1.5rem',
        'qg-3xl': '1.875rem',
        'qg-4xl': '2.25rem',
        'qg-5xl': '3rem',
        'qg-6xl': '3.75rem',
      },
      spacing: {
        'qg-1': '0.25rem',
        'qg-2': '0.5rem',
        'qg-3': '0.75rem',
        'qg-4': '1rem',
        'qg-5': '1.25rem',
        'qg-6': '1.5rem',
        'qg-8': '2rem',
        'qg-10': '2.5rem',
        'qg-12': '3rem',
        'qg-16': '4rem',
        'qg-20': '5rem',
      },
      borderRadius: {
        'qg-sm': '4px',
        'qg-md': '8px',
        'qg-lg': '12px',
        'qg-xl': '16px',
        'qg-2xl': '24px',
      },
      boxShadow: {
        'qg-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'qg-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'qg-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'qg-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      transitionDuration: {
        'qg-fast': '150ms',
        'qg-normal': '300ms',
        'qg-slow': '500ms',
      },
      animation: {
        'qg-fade-in': 'qgFadeIn 0.5s ease-in-out',
        'qg-slide-up': 'qgSlideUp 0.5s ease-out',
      },
      keyframes: {
        qgFadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        qgSlideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
