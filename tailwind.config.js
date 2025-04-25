/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        // Using web font names that work across platforms
        Roboto: ['Roboto', 'sans-serif'],
        'Roboto-Bold': ['Roboto-Bold', 'Roboto', 'sans-serif'],
        'Roboto-Medium': ['Roboto-Medium', 'Roboto', 'sans-serif'],
        'Roboto-Light': ['Roboto-Light', 'Roboto', 'sans-serif'],
        'Roboto-Thin': ['Roboto-Thin', 'Roboto', 'sans-serif'],
        'Roboto-Semibold': ['Roboto-Semibold', 'Roboto', 'sans-serif'], // Corrected name
        'Roboto-ExtraBold': ['Roboto-ExtraBold', 'Roboto', 'sans-serif'],
        'Roboto-ExtraLight': ['Roboto-ExtraLight', 'Roboto', 'sans-serif'],
        'Pacifico-Regular': ['Pacifico', 'cursive'],
      },
      screens: {
        '2xl': '1536px',
        xl: '1280px',
        lg: '1024px',
        md: '768px',
        sm: '425px',
        xs: '375px',
      },
    },
  },
  plugins: [],
};
