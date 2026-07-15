module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./pages/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-slate": "#0f1724",
        "deep-blue": "#0b3d91",
        crimson: "#dc143c",
        "news-white": "#ffffff",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
