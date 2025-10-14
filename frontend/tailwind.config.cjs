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
        // Nature, Premium & Friendly palette (matching reference sites)
        primary: '#22c55e', // Primary Green
        primaryDark: '#15803d', // Green-700
        primaryLight: '#86efac', // Green-300
        accent: '#fde68a', // Yellow Accent (soft)
        accentStrong: '#facc15', // Deeper Yellow for emphasis
        accentSoft: '#fef9c3', // Soft yellow background
        cream: '#f9fafb', // Cream / natural white
        softGray: '#f3f4f6', // Content background
        earth: '#8d6e63', // Soft Earth Brown
        earthDeep: '#795548', // Deeper earth tone
        pastel: {
          green: '#EAF8ED',
          yellow: '#FFF8E1',
          brown: '#EFE7E3',
          gray: '#F5F7FA'
        },
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
        // Modern, friendly headings and body
        display: ['"Jost"', '"Montserrat"', '"Poppins"', 'system-ui', 'sans-serif'],
        body: ['"Jost"', '"Montserrat"', '"Poppins"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        premium: '0 12px 28px -12px rgba(0,0,0,0.18)',
        soft: '0 6px 20px rgba(0,0,0,0.06)',
        card: '0 8px 24px -8px rgba(0,0,0,0.12)'
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 18px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' }
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translate3d(-18px, 0, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' }
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translate3d(18px, 0, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-soft both',
        fadeInUp: 'fadeInUp 0.6s ease-soft both',
        fadeInLeft: 'fadeInLeft 0.6s ease-soft both',
        fadeInRight: 'fadeInRight 0.6s ease-soft both'
      }
    }
  },
  plugins: []
}