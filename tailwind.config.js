/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors: {
      tr: 'transparent',
      white: '#FFFFFF',
      black: '#000000',
      red: '#FF0000',
      blue: '#0000FF',
      green: '#008000',
      yellow: '#FFFF00',
    },
    extend: {},
  },
  plugins: [],
};
