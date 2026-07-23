/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#2D7A7E',
          50: '#E4F0F0',
          100: '#C8E0E1',
          200: '#91C1C3',
          300: '#5AA2A5',
          400: '#2D7A7E',
          500: '#2D7A7E',
          600: '#256467',
          700: '#1D4E51',
          800: '#15393B',
          900: '#0D2425',
          light: '#52B5BA',
        },
        amber: {
          DEFAULT: '#C4883A',
          50: '#F5EDE0',
          100: '#EBDBC1',
          200: '#D7B783',
          300: '#C4883A',
          400: '#C4883A',
          500: '#A6732F',
          600: '#885E26',
          light: '#D9A34E',
        },
        completion: {
          DEFAULT: '#3D8B6E',
          light: '#5DB08E',
        },
        surface: {
          DEFAULT: '#F0EDEA',
          card: '#FFFFFF',
          dark: '#141418',
          'card-dark': '#1E1E26',
        },
        ink: {
          DEFAULT: '#28282C',
          sub: '#6B665E',
          muted: '#A09A92',
          line: '#E4E0DA',
          dark: '#E0DCD4',
          'sub-dark': '#908A82',
          'muted-dark': '#5C5850',
          'line-dark': '#2E2E38',
        },
        nav: {
          DEFAULT: '#FAFAF8',
          dark: '#1A1A22',
        },
      },
      fontFamily: {
        display: ['Georgia', '"Palatino Linotype"', '"Book Antiqua"', 'serif'],
        arabic: ['"Noto Naskh Arabic"', '"Traditional Arabic"', '"Simplified Arabic"', '"Arabic Typesetting"', 'serif'],
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
