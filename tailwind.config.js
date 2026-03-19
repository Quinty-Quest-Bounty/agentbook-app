/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        card: { DEFAULT: '#18181b', foreground: '#fafafa' },
        primary: { DEFAULT: '#6366f1', foreground: '#ffffff' },
        secondary: { DEFAULT: '#27272a', foreground: '#fafafa' },
        muted: { DEFAULT: '#27272a', foreground: '#a1a1aa' },
        accent: { DEFAULT: '#ef4444', foreground: '#ffffff' },
        destructive: { DEFAULT: '#ef4444', foreground: '#ffffff' },
        border: '#27272a',
        input: '#27272a',
        ring: '#6366f1',
        star: '#facc15',
        ton: '#0098ea',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
