/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066ff',
        'primary-dark': '#0052cc',
        accent: '#00d4ff',
      },
    },
  },
  plugins: [],
}