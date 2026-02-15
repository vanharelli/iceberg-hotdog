/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iceberg: '#0077FF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Optional, but good for UI
      },
    },
  },
  plugins: [],
}
