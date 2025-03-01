/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rich-black': '#2D3436',
        'medium-gray': '#636E72',
        'vibrant-purple': '#6C5CE7',
        'off-white': '#F8F9FA',
        'light-gray': '#DFE6E9',
        'electric-blue': '#0984E3',
        'error-red': '#FF5252',
        'warning-yellow': '#FFC107',
      }
    },
  },
  plugins: [],
} 