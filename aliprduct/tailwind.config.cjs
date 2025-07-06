/** @type {import('tailwindcss').Config} */
module.exports = {
  
  darkMode: 'class', // فعال‌سازی dark mode با استراتژی class
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
        serif: ['Vazirmatn', 'serif'],
      },
    },
  },
  plugins: [],
}
