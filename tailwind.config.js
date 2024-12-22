/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      white: '#f0f2f5',
      black: {
        title: '#001529',
        firstText: '#000000E0',
        secondText: '#000000A6',
      },
      gray: {
        400: '#fafafa',
        500: '#bfbfbf',
        DEFAULT: '#141414',
        700: '#1f1f1f',
        800: '#262626',
        900: '#1f1f1f',
      },
      gold: {
        100: '#2b2111',
        200: '#443111',
        300: '#594214',
        400: '#7c5914',
        500: '#aa7714',
        DEFAULT: '#d89614',
        700: '#e8b339',
        800: '#f3cc62',
        900: '#f8df8b',
        1000: '#faedb5',
      },
      geekBlue: {
        500: '#597ef7',
        600: '#2f54eb',
        1000: '#002329',
      },
    },
  },
  plugins: [],
}
