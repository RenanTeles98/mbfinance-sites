/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./mb-finance-completo.html'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#003956',
        'brand-secondary': '#0099dd',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
