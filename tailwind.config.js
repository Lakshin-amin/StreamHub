/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#08080C',
          surface: '#121119',
          raised: '#1A1922',
          line: '#262430',
        },
        marquee: {
          gold: '#E8B34D',
          amber: '#F4C868',
        },
        signal: {
          violet: '#8B6CFF',
        },
        ink: {
          DEFAULT: '#F3F1EC',
          dim: '#9C99A8',
          faint: '#5E5B69',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        marquee: '0.08em',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(232, 179, 77, 0.35)',
        violetglow: '0 0 40px -10px rgba(139, 108, 255, 0.45)',
      },
      backgroundImage: {
        'film-grain':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadein: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        fadein: 'fadein 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
