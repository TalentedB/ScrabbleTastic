/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Add a custom 15-column grid
        15: "repeat(15, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
