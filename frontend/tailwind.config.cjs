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
        // Nature, Premium & Friendly palette
        primary: '#22c55e', // Tailwind green-500
        primaryDark: '#15803d', // green-700
        primaryLight: '#86efac', // green-300
        accent: '#facc15', // yellow-400
        accentLight: '#fde68a', // yellow-300/200
        accentSoft: '#fef9c3', // soft yellow
        cream: '#f9fafb', // natural white/gray-50
        softGray: '#f3f4f6', // gray-100/200
        earth: '#795548', // brown
        earthLight: '#8d6e63', // brown light
        sage: '#a7c957', // wellness-focused green
        olive: '#7c9473', // muted olive
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
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        serifSoft: ['"Merriweather"', '"Lora"', 'serif']
      },
      boxShadow: {
        premium: '0 10px 25px -5px rgba(46, 125, 50, 0.20), 0 8px 10px -6px rgba(46, 125, 50, 0.15)',
        soft: '0 6px 20px rgba(0,0,0,0.06)'
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    }
  },
  plugins: []
}