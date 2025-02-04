/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ['Roboto-Regular', 'sans-serif'],
        'Roboto-Bold': ['Roboto-Bold', 'sans-serif'],
        'Roboto-Medium': ['Roboto-Medium', 'sans-serif'],
        'Roboto-Light': ['Roboto-Light', 'sans-serif'],
        'Roboto-Thin': ['Roboto-Thin', 'sans-serif'],
        'Roboto-SemiBold': ['Roboto-SemiBold', 'sans-serif'],
        'Roboto-ExtraBold': ['Roboto-ExtraBold', 'sans-serif'],
        'Roboto-ExtraLight': ['Roboto-ExtraLight', 'sans-serif'],
        'Pacifico-Regular': ['Pacifico-Regular', 'cursive'],
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
