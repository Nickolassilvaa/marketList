/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    extend: {},
    colors: {
      white: "#FFF",
      gray: {
        100: "#E1E1E6",
        300: "#C4C4CC",
        400: "#8D8D99",
        500: "#7C7C8A",
        600: "#323238",
        700: "#29292E",
        800: "#202024",
        900: "#121214",
      },

      purple: {
        100: "#734bd1",
        200: "#6833e4",
        300: "#2a165e",
      },

      red: {
        100: "#AB222E",
        200: "#7A1921",
      },

      green: {
        100: "#00875F",
        200: "#015F43",
      },
    },
  },
  plugins: [],
};
