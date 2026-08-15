/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--bg)",
        surface: "var(--surface-solid)",
        "surface-muted": "var(--surface-muted)",
        ink: "var(--text)",
        muted: "var(--text-muted)",
        accent: "var(--accent)",
      },
      borderRadius: {
        nlock: "var(--radius-md)",
        "nlock-lg": "var(--radius-lg)",
        "nlock-xl": "var(--radius-xl)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        panel: "var(--shadow-panel)",
        accent: "var(--shadow-accent)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        display: "var(--font-display)",
      },
    },
  },
  plugins: [],
};
