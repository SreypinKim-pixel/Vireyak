/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        ring: "var(--ring)",
        midnight: "#0E0D15",
        navy: "#182346",
        indigo: "#3D5387",
        slate: "#7C83AD",
        gold: "#D4AF37",
        brightgold: "#F3CD5F",
        ivory: "#FBF9F6",
        surface: "rgb(var(--surface) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        brand: "rgb(var(--brand) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      fontFamily: { sans: ["Poppins", "sans-serif"] },
      boxShadow: {
        soft: "0 8px 32px -12px rgb(24 35 70 / 0.15)",
        search: "0 12px 40px -12px rgb(14 13 21 / 0.2)",
      },
    },
  },
  plugins: [],
};
