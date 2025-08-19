/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#534FEB',
        secondary: '#ef4444', 
        accent: '#3b82f6', 
        background: '#FFFFFF', 
        default_text: '#000000',  

        success: '#600433', 
        danger: '#808E8E', 
        
        border: '#E5E7EB',
        grey: "#F6F6F6",

      },
    },
  },
  plugins: [],
};