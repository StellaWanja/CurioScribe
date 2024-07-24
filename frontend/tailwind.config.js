/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'raisin-black': '#212738',
      'lavender': '#B77BFF',
      'flash-white': '#EDF2EF',
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    }
  },
  plugins: [],
}

