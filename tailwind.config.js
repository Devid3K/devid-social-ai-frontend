/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'space-dark': '#050510',
        'space-card': 'rgba(10, 14, 30, 0.85)',
        'space-border': 'rgba(103, 232, 249, 0.12)',
        cosmic: {
          50: '#e0f7ff',
          100: '#b3ecff',
          200: '#67e8f9',
          300: '#22d3ee',
          400: '#06b6d4',
          500: '#0891b2',
          600: '#0e7490',
          700: '#155e75',
        },
        nebula: {
          pink: '#f472b6',
          purple: '#a78bfa',
          blue: '#60a5fa',
          cyan: '#22d3ee',
        },
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#22d3ee',
          600: '#06b6d4',
          700: '#0891b2',
        },
        anime: {
          pink: '#ff6b9d',
          purple: '#c084fc',
          blue: '#60a5fa',
          green: '#4ade80',
        },
      },
      fontFamily: {
        sans: ['"M PLUS Rounded 1c"', 'Prompt', 'sans-serif'],
        thai: ['Prompt', 'sans-serif'],
        anime: ['"M PLUS Rounded 1c"', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.15)',
        'glow-purple': '0 0 20px rgba(167, 139, 250, 0.15)',
      },
    },
  },
  plugins: [],
}
