/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        card: { DEFAULT: '#141416', foreground: '#fafafa' },
        primary: { DEFAULT: '#2563eb', foreground: '#ffffff' },
        secondary: { DEFAULT: '#1c1c1f', foreground: '#e4e4e7' },
        muted: { DEFAULT: '#1c1c1f', foreground: '#71717a' },
        accent: { DEFAULT: '#dc2626', foreground: '#ffffff' },
        destructive: { DEFAULT: '#dc2626', foreground: '#ffffff' },
        border: '#222225',
        input: '#1c1c1f',
        ring: '#2563eb',
        star: '#facc15',
        success: '#22c55e',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
