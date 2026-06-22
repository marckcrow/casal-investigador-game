/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: '#0a0a0a',
        noir2: '#111111',
        gold: '#c9a84c',
        goldLight: '#e8c96a',
        crimson: '#c41e3a',
        paper:      '#f0ece3',   /* high-contrast warm off-white */
        paperDim:   '#b8b0a0',   /* brighter secondary text */
      },
      fontFamily: {
        typewriter: ['"Special Elite"', 'monospace'],
        serif: ['"Crimson Pro"', 'serif'],
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1.5' }],   // 12px → 13px
        'sm':   ['0.875rem', { lineHeight: '1.6' }],   // 14px → 15px
        'base': ['1.0625rem',{ lineHeight: '1.7' }],   // 17px → 17px (base)
        'lg':   ['1.125rem', { lineHeight: '1.6' }],   // 18px → 18px
        'xl':   ['1.25rem',  { lineHeight: '1.5' }],   // 20px → 20px
        '2xl':  ['1.5rem',   { lineHeight: '1.4' }],   // 24px → 24px
        '3xl':  ['1.875rem', { lineHeight: '1.3' }],   // 30px → 30px
        '4xl':  ['2.25rem',  { lineHeight: '1.2' }],   // 36px → 36px
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
