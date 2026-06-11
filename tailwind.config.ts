import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/views/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/entities/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FFCC00',
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE699',
          300: '#FFDA66',
          400: '#FFCD33',
          500: '#FFCC00',
          600: '#CCA300',
          700: '#997A00',
          800: '#665200',
          900: '#332900',
        },
        dark: {
          DEFAULT: '#21201F',
          50: '#F7F7F7',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#A8A8A8',
          400: '#6B6B6B',
          500: '#3D3D3D',
          600: '#2F2F2F',
          700: '#252525',
          800: '#1A1A1A',
          900: '#21201F',
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 25px rgba(0, 0, 0, 0.12)',
        'hard': '0 10px 40px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
export default config
