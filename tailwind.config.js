/** @type {import('tailwindcss').Config} */
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
    colors: {
      white: '#f9f9f9',
      black: {
        title: '#001529',
        firstText: '#000000E0',
        secondText: '#000000A6',
      },
      gray: {
        200: '#f9fbfd',
        400: '#fafafa',
        500: '#e6ecf2',
        600: '#bfbfbf',
        DEFAULT: '#141414',
        700: '#1f1f1f',
        800: '#262626',
      },
      // 文本颜色
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        tertiary: '#64748b',
        muted: '#94a3b8',
        onDark: '#ffffff',
        onDarkSecondary: '#cbd5e1',
        onDarkTertiary: '#94a3b8',
      },
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
      // 边框颜色
      border: {
        light: '#e2e8f0',
        medium: '#cbd5e1',
        dark: '#94a3b8',
      },
      amber: {
        50: '#fefce8',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },
      emerald: {
        600: '#10b981',
      },
    },
  },
  plugins: [],
}
