// tailwind.config.js
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      lilita: ['"Lilita One"', 'cursive'],  // Add Lilita One font
    },
  },
  plugins: [],

}
