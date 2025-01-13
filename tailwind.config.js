/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.25': '1.3125rem',
        '7.5': '1.875rem'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 6px 12px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      colors: {
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        indigo: {
          50: '#F4E5FF', // Très clair, pastel
          100: '#E4B3FF', // Clair
          200: '#D27FFF', // Moyennement clair
          300: '#BF4CFF', // Vibrant
          400: '#A822FF', // Flashy
          500: '#8700FF', // Couleur principale
          600: '#7600E6', // Légèrement plus foncé
          700: '#6200C4', // Plus profond
          800: '#5000A3', // Plus sombre
          900: '#3E0081', // Très sombre
        },
      },
    },
  },
  plugins: [],
};