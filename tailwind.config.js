/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--bg-color)",
          dark: "#030014",
          light: "#f8fafc",
        },
        surface: {
          DEFAULT: "var(--surface-color)",
          dark: "#050414",
          light: "#ffffff",
        },
        primary: {
          DEFAULT: "#8245ec",
          light: "#a78bfa",
          dark: "#6b21a8",
        },
        secondary: {
          DEFAULT: "#e879f9",
          cyan: "#38bdf8",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 6s ease infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'neon': '0 0 25px rgba(130, 69, 236, 0.45)',
        'neon-cyan': '0 0 25px rgba(56, 189, 248, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(130, 69, 236, 0.08)',
      },
    },
  },
  plugins: [],
}
