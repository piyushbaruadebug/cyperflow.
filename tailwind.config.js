/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
        apex: {
          canvas: '#F1F1F5',
          ink: '#080809',
          muted: '#A3AAB7',
          navy: '#051269',
          blue: '#0B25C4',
          green: '#13A750',
          amber: '#F99A03',
        },
      },
    },
  },
  plugins: [],
}
