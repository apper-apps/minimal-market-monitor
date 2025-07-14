/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#666666',
        accent: '#2563eb',
        surface: '#ffffff',
        background: '#fafafa',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-cart': 'bounce 0.5s ease-in-out',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}