/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14213D',
          light: '#1F3358',
          dark: '#0B1526',
        },
        paper: '#F5F6F8',
        accent: {
          DEFAULT: '#FFB627',
          dark: '#E29F1E',
          light: '#FFD589',
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        muted: '#64748B',
        line: '#E2E5EA',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,33,61,0.06), 0 1px 12px rgba(20,33,61,0.05)',
        stamp: '0 8px 24px rgba(255,182,39,0.35)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.8' },
          '80%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        stampDown: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite',
        stampDown: 'stampDown 0.35s ease-out',
      },
    },
  },
  plugins: [],
}
