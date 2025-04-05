/** @type {import('tailwindcss').Config} */
export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
     extend: {
       colors: {
         primary: '#f0f4ff',    // light background
         secondary: '#eef2ff', // features section bg
         highlight: '#A294F9', // buttons, headings
         accent: '#CDC1FF',    // footer bg
       },
     },
   },
   plugins: [],
 };
 