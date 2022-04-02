module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        milonga: ["Milonga", "cursive"],
        nunito: ["Nunito", "sans-serif"]
      },
      colors: {
        "primary-light": "#f3f4f6",
        "secondary-light": "#fff",
        "primary-dark": "#1b1d21",
        "secondary-dark": "#222326"
      }
    }
  },
  plugins: []
};
