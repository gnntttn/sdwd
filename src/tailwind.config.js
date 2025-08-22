/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Amiri', 'serif'],
        'sans-arabic': ['Noto Sans Arabic', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        // New futuristic color palette
        primary: {
          light: '#63b3ed',
          DEFAULT: '#3182ce',
          dark: '#2c5282',
        },
        accent: {
          light: '#66fcf1',
          DEFAULT: '#45a29e',
          dark: '#1f2833',
        },
        glow: {
          DEFAULT: '#66fcf1',
          dark: '#45a29e',
        },
        base: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        space: {
          100: '#232931',
          200: '#1f2833',
          300: '#0b0c10',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 8px rgba(102, 252, 241, 0.3)',
        'glow-md': '0 0 16px rgba(102, 252, 241, 0.4)',
        'glow-lg': '0 0 24px rgba(102, 252, 241, 0.5)',
      },
      animation: {
        'aurora': 'aurora 60s linear infinite',
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
      },
    },
  },
  plugins: [],
};
