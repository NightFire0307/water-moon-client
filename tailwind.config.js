/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  content: [
    './index.html',
    './src/**/*.{jsx,tsx}',
  ],
  theme: {
    backgroundPosition: {
      'left-center': 'left center',
      'right-center': 'right center',
    },
    screens: {
      'sm': '576px',
      'md': '768px',
      'lg': '992px',
      'xl': '1200px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        darkBlueGray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        semantic: {
          primary: colors.cyan[600],
          success: colors.emerald[600],
          warning: colors.amber[600],
          danger: colors.rose[600],
          info: colors.indigo[500],
          neutral: colors.gray[600],
        },
      },
    },
  },
  plugins: [],
}
