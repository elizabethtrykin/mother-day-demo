/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          25: 'rgb(252 252 253)',
          50: 'rgb(250 250 250)',
          100: 'rgb(244 244 245)',
          200: 'rgb(228 228 231)',
          300: 'rgb(216 215 212)',
          400: 'rgb(161 161 170)',
          500: 'rgb(113 113 122)',
          600: 'rgb(255 250 234)',
          700: 'rgb(63 63 70)',
          800: 'rgb(39 39 42)',
          900: 'rgb(24 24 27)',
          950: 'rgb(9 9 11)',
          'bg-alt': 'rgb(255 250 234)',
          'bg-main': 'rgb(14 14 19)',
          'border': 'rgb(217 211 194)',
        },
        brand: {
          blue: 'rgb(77 202 250)',
          green: 'rgb(187 245 41)',
          orange: 'rgb(233 107 52)',
          pink: 'rgb(222 148 226)',
          primary: 'rgb(98 246 181)',
          'primary-hovered': 'rgb(130 248 196)',
          purple: 'rgb(153 119 255)',
          yellow: 'rgb(255 221 3)',
        },
        blue: {
          9: 'rgb(0 144 255)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      zIndex: {
        elevated: '1',
        header: '50',
      },
      screens: {
        xs: '26.25rem',
      },
      fontSize: {
        '2xs': '0.75rem',
        xs: '0.875rem',
        sm: '0.9375rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.375rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
        '5xl': '3.5rem',
        '6xl': '4.25rem',
        '7xl': '7.5rem',
        '8xl': '9rem',
        '9xl': '10.5rem',
        '10xl': '12rem',
      },
      keyframes: {
        slideDown: {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        slideUp: {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        scroll: {
          to: { transform: 'translate(calc(-50% - 0.5rem))' },
        },
      },
      animation: {
        slideDown: 'slideDown 300ms ease-out',
        slideUp: 'slideUp 300ms ease-out',
        scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, normal) linear infinite',
      },
    },
  },
  plugins: [],
} 