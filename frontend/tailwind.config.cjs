/**
 * Tailwind configuration with premium green/yellow theme.
 * Colors:
 * - primary: #22c55e (green)
 * - accent:  #fde68a (yellow)
 */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e',
        accent: '#fde68a',
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917'
        }
      },
      boxShadow: {
        premium: '0 10px 25px -5px rgba(34, 197, 94, 0.2), 0 8px 10px -6px rgba(34, 197, 94, 0.15)'
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }
  },
  plugins: []
}