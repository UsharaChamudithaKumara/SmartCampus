/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          600: '#4f46e5'
        },
        neutral: {
          900: '#0f1724',
          800: '#0b1220',
          700: '#0f172a'
        },
        accent: {
          DEFAULT: '#0ea5a4'
        },
        success: '#10b981',
        warn: '#f59e0b',
        danger: '#ef4444'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'scale(.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out both',
        'slide-up': 'slideUp 350ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'pop': 'pop 220ms cubic-bezier(0.22, 1, 0.36, 1) both',
      }
    },
  },
  plugins: [],
}

