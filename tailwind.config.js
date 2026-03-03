/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Định nghĩa tên class mới: 'font-sans' sẽ dùng Montserrat
        sans: ['Montserrat', 'sans-serif'],
        // Định nghĩa tên class mới: 'font-serif' sẽ dùng Playfair Display
        serif: ['Playfair Display', 'serif'],
      },
      // Bạn có thể định nghĩa màu nhấn ở đây
      colors: {
        'navy': '#1E3A8A', // Ví dụ màu xanh navy
        'beige': { // Ví dụ màu be với các sắc độ
          'DEFAULT': '#D4C4AE',
          'light': '#EAE0D5',
          'dark': '#BFAC95',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
