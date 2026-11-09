/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        diwali: {
          dark: '#05040a',
          navy: '#0b0c1e',
          gold: '#ffd166',
          deepGold: '#d4af37',
          lightGold: '#fff3b0',
          amber: '#f77f00',
          flame: '#ff4800',
          marigold: '#fcbf49',
          crimson: '#9d0208',
          royalPurple: '#1e0826'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        decorative: ['Rozha One', 'Cinzel Decorative', 'serif']
      },
      animation: {
        'flame-flicker': 'flicker 2s infinite ease-in-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', opacity: '0.95' },
          '25%': { transform: 'scale(1.05, 0.98) rotate(1deg)', opacity: '1' },
          '50%': { transform: 'scale(0.97, 1.04) rotate(-0.5deg)', opacity: '0.9' },
          '75%': { transform: 'scale(1.03, 1.01) rotate(0.8deg)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(255, 180, 50, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(255, 140, 20, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}

