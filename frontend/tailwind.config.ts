import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mateus: {
          blue: {
            DEFAULT: '#003893',
            50: '#eef4ff',
            100: '#e0ebff',
            500: '#1a54b2',
            600: '#003893',
            700: '#002d77',
            800: '#00225c',
            900: '#001944',
          },
          red: {
            DEFAULT: '#E31826',
            50: '#fff1f2',
            100: '#ffe4e6',
            500: '#f43f5e',
            600: '#E31826',
            700: '#be123c',
            800: '#9f1239',
          },
          sky: {
            DEFAULT: '#009EE3',
            50: '#f0f9ff',
            100: '#e0f2fe',
            400: '#38bdf8',
            500: '#009EE3',
            600: '#0284c7',
          },
          surface: {
            DEFAULT: '#F8FAFC',
            subtle: '#F1F5F9',
          },
        },
        brand: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 56, 147, 0.08)',
        card: '0 2px 14px rgba(0, 0, 0, 0.06)',
        heart: '0 6px 20px rgba(227, 24, 38, 0.35)',
        dentinho: '0 8px 24px rgba(0, 158, 227, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
