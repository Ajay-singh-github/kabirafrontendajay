import scrollbarHide from 'tailwind-scrollbar-hide'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hemera: ['Hemera'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [scrollbarHide],
}
