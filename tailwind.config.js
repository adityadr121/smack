/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          500: '#0284C7',
          600: '#0EA5E9',
          700: '#0369A1',
          900: '#0C4A6E',
        },
        emerald: {
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706',
        },
        critical: {
          500: '#EF4444',
          600: '#DC2626',
        },
        dark: {
          bg: '#090D16',
          card: '#111827',
          cardBorder: 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'scan-line': 'scanLine 3s infinite linear',
        'float-particle': 'floatParticle 6s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)' },
          '50%': { boxShadow: '0 0 35px rgba(239, 68, 68, 0.9)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        floatParticle: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(5deg)' },
        }
      }
    },
  },
  plugins: [],
}
