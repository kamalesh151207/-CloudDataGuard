/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
          accent: '#06b6d4', // Cyan accent
        },
        cloudDark: {
          bg: '#090d16',       // Deep navy background
          card: '#0f172a',     // Card slate navy
          sidebar: '#0b1120',  // Sidebar background
          border: '#1e293b',   // Subtle border
          hover: '#1e293b',
        },
        verified: {
          light: '#dcfce7',
          DEFAULT: '#10b981', // Emerald 500
          dark: '#059669',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
        redundant: {
          light: '#ffe4e6',
          DEFAULT: '#f43f5e', // Rose 500
          dark: '#e11d48',
          glow: 'rgba(244, 63, 94, 0.25)',
        },
        invalid: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b', // Amber 500
          dark: '#d97706',
          glow: 'rgba(245, 158, 11, 0.25)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-rose': '0 0 20px -5px rgba(244, 63, 94, 0.3)',
        'glow-amber': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
