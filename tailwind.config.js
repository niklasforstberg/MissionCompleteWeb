/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#2A4834',
        'sage-green': '#87A878',
        'soft-beige': '#F5F2ED',
        'charcoal': '#333333',
      }
    },
  },
  plugins: [],
} 