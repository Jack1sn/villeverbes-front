/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito"],
      },
      colors: {
        background: "#fff",
        button: "#3b76bc",
        title: "#0a0d31",
        text: "#000000",
        hover: "#5386c4",
        divider: "#cdcdcd",
        brown: {
          100: "#F0EDE7",
          200: "#E3D8C9",
          300: "#D6C2AB",
          400: "#BC9670",
          500: "#7B3F00",
          600: "#6E3900",
          700: "#492700",
          800: "#371D00",
          900: "#251300",
        },
      },
    },
  },
  plugins: [],
};
