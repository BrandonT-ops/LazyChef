import type { Config } from "tailwindcss";

// Colors come from CSS variables in src/app/globals.css (Marché palette),
// so light/dark mode and future palette tweaks happen in one place.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        ink: token("ink"),
        muted: token("muted"),
        line: token("line"),
        tomato: token("tomato"),
        mango: token("mango"),
        leaf: token("leaf"),
        hibiscus: token("hibiscus"),
      },
      fontFamily: {
        display: ['"Trebuchet MS"', "ui-rounded", "system-ui", "sans-serif"],
        sans: ["system-ui", "-apple-system", '"Segoe UI"', "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 20px -8px rgb(var(--tomato) / 0.25)",
        lift: "0 14px 30px -10px rgb(var(--tomato) / 0.35)",
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
