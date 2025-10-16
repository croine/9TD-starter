/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f8fcff",
          100: "#ebf6ff",
          200: "#cfe9ff",
          300: "#a6d8ff",
          400: "#5cbaff",
          500: "#2eaaff",
          600: "#1793e5",
          700: "#1173b5",
          800: "#0b5283",
          900: "#083c60",
        },
        cozy: {
          50: "#fffaf5",
          100: "#fff1e6",
          200: "#ffe2cc",
          300: "#ffd0a6",
          400: "#ffb870",
          500: "#ffa13a",
        },
      },
      boxShadow: {
        cozy: "0 10px 25px -10px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        "2xl": "1.5rem",
      },
      transitionTimingFunction: {
        "soft-spring": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    },
  },
  plugins: [],
}
