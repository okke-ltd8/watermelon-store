import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        watermelon: {
          pink:       '#FF4F87',
          'pink-light': '#FFF0F5',
          'pink-dark':  '#CC2060',
          green:      '#48C774',
          'green-light': '#F0FFF6',
          'green-dark':  '#2E8A50',
          red:        '#FF5C5C',
          dark:       '#0D1117',
          card:       '#161B22',
          border:     '#E8ECF0',
          muted:      '#5F6B7A',
          bg:         '#FAFBFC',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-pink': 'pulse-pink 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'seed-spin': 'seed-spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'pulse-pink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        },
        'seed-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
