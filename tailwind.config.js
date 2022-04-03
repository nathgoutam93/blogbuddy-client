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
      },
      animation: {
        "enter-b": "enter-b 400ms ease-in-out forwards",
        "enter-r": "enter-r 400ms ease-in-out forwards"
      },
      keyframes: {
        "enter-b": {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "enter-r": {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        }
      }
    }
  },
  plugins: []
};
