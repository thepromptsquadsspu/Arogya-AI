/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffaff',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          900: '#164e63',
          950: '#083344',
        },
        emergency: {
          light: '#fef2f2',
          DEFAULT: '#ef4444',
          dark: '#991b1b',
        },
        gp: {
          light: '#fffbeb',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        selfcare: {
          light: '#ecfdf5',
          DEFAULT: '#10b981',
          dark: '#047857',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.35)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.45)',
      }
    },
  },
  plugins: [],
}
