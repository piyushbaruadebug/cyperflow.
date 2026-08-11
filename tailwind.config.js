/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        dark: {
          950: '#070b14',
          900: '#0b1329',
          850: '#0f1a38',
          800: '#142247',
          700: '#1b2c5a',
          600: '#253d7a',
        },
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          400: '#38bdf8',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        accent: {
          cyan: '#06b6d4',
          indigo: '#6366f1',
          emerald: '#10b981',
        },
      },
    },
  },
  plugins: [],
}