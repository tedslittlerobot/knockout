/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'street-fighter': ['Rock Salt', 'cursive', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
