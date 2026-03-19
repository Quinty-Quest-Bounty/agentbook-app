/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a14',
        foreground: '#f0f0f5',
        card: { DEFAULT: '#1e1f35', foreground: '#f0f0f5' },
        primary: { DEFAULT: '#0EA885', foreground: '#ffffff' },
        secondary: { DEFAULT: '#12121f', foreground: '#f0f0f5' },
        muted: { DEFAULT: '#1a1b2e', foreground: '#9494ab' },
        accent: { DEFAULT: '#0EA885', foreground: '#ffffff' },
        destructive: { DEFAULT: '#ef4444', foreground: '#ffffff' },
        border: 'rgba(255, 255, 255, 0.12)',
        input: 'rgba(255, 255, 255, 0.10)',
        ring: '#0EA885',
        star: '#FFD700',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
