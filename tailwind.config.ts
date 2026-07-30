import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        coral: '#FF6A5B',
        'coral-press': '#E24F41',
        pink: '#FF7DAE',
        lavender: '#B87DFF',
        teal: '#00B4A6',
        charcoal: '#111111',
        navy: '#16213E',
        amber: '#FFB13F',
        blue: '#4C9AFF',
        'link-blue': '#2F6FD0',

        // Neutral colors
        'gray-050': '#FAFAFA',
        'gray-100': '#F2F2F2',
        border: '#E9E9E9',
        'border-strong': '#E4E4E4',
        hairline: '#ECECEC',
        'text-body': '#333333',
        'text-muted': '#6A6A6A',
        'text-faint': '#8A8A8A',

        // Chip colors
        'chip-grade-bg': '#F4E9FF',
        'chip-grade-fg': '#6B2FB5',
        'chip-skill-bg': '#E6F8F6',
        'chip-skill-fg': '#00756C',
        'chip-fit-bg': '#FFF0EC',
        'chip-fit-fg': '#C0432F',
        'chip-ef-bg': '#F0FBF4',
        'chip-ef-fg': '#1F6B45',
        'chip-misconception-bg': '#FFF5F9',
        'chip-misconception-fg': '#B3336E',
        'chip-prior-bg': '#EAF2FF',
        'chip-prior-fg': '#2F6FD0',

        // Card thumbnail tints
        'thumb-1': '#FFE3DD',
        'thumb-2': '#FFE7F1',
        'thumb-3': '#F1E5FF',
        'thumb-4': '#DDF5F2',
        'thumb-5': '#F3F3F3',
        'thumb-6': '#FFEFE4',
      },
      fontSize: {
        // Page H1: 34px/700/-.03em
        'h1': ['34px', { lineHeight: '1.08', letterSpacing: '-.03em', fontWeight: '700' }],
        // Hero H1: 54px/700/-.03em
        'hero-h1': ['54px', { lineHeight: '1.04', letterSpacing: '-.03em', fontWeight: '700' }],
        // Section H2: 26px/700/-.02em
        'h2': ['26px', { lineHeight: '1', letterSpacing: '-.02em', fontWeight: '700' }],
        // Card title: 15.5px/600/-.015em
        'card-title': ['15.5px', { lineHeight: '1.28', letterSpacing: '-.015em', fontWeight: '600' }],
        // Body: 14–15px/400
        'body': ['15px', { lineHeight: '1.65', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        // Micro-label (uppercase): 10.5–11px/700/.1–.16em
        'label': ['10.5px', { lineHeight: '1', letterSpacing: '.1em', fontWeight: '700' }],
        'label-lg': ['11px', { lineHeight: '1', letterSpacing: '.16em', fontWeight: '700' }],
        // Chip: 10.5–12.5px/600
        'chip': ['11px', { lineHeight: '1', fontWeight: '600' }],
        // Nav item: 11.5px/600/.1em uppercase
        'nav': ['11.5px', { lineHeight: '1', letterSpacing: '.1em', fontWeight: '600' }],
        // Eyebrow: 13px/600
        'eyebrow': ['13px', { lineHeight: '1', fontWeight: '600' }],
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'hero': '20px',
        'card': '14px',
        'panel': '16px',
        'button': '10px',
        'input': '12px',
        'chip': '5px',
        'pill': '999px',
      },
      spacing: {
        // Standard spacing
        'gutter': '32px',
        'section': '54px',
        'section-sm': '40px',
        'gap-grid': '20px',
        'gap-blueprint': '16px',
        'sticky-header': '72px',
        'sticky-offset': '96px',
      },
      maxWidth: {
        'home': '1400px',
        'library': '1400px',
        'videos': '1400px',
        'detail': '1200px',
        'pricing': '1180px',
        'match': '1120px',
      },
      boxShadow: {
        'search': '0 12px 34px rgba(17,17,17,.09)',
        'search-md': '0 10px 30px rgba(17,17,17,.07)',
      },
      backdropBlur: {
        'light': 'blur(10px)',
        'card': 'blur(6px)',
      },
      keyframes: {
        'up-rise': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'up-pulse': {
          '0%, 100%': { opacity: '.3' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'up-rise': 'up-rise 0.35s ease both',
        'up-pulse': 'up-pulse 1.1s infinite',
      },
    },
  },
  plugins: [],
}

export default config
