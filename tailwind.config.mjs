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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#9900ff',
        accent: '#9966ff',
        secondary: 'var(--secondary)',
      },
      fontFamily: {
        pixelify: ['"Pixelify Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
