
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          50: '#F9F5E6',
          100: '#F4ECCF',
          200: '#EAD9A1',
          300: '#E0C673',
          400: '#D4AF37', // Base
          500: '#AA8C2C',
          600: '#806921',
          700: '#554616',
          800: '#2B230B',
          900: '#000000',
        },
        dark: {
          DEFAULT: '#0a0a0a',
          100: '#1a1a1a',
          200: '#2a2a2a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'gradient-radial-gold': 'radial-gradient(circle at center, #D4AF37 0%, #0a0a0a 100%)',
        'gradient-radial-dark': 'radial-gradient(circle at top right, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
      }
    },
  },
  plugins: [],
}
