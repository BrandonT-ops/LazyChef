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
        subtle: token("subtle"),
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
        display: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
        sans: ['"Inter Variable"', "Inter", "system-ui", "-apple-system", '"Segoe UI"', "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgb(0 0 0 / 0.04), 0 1px 3px rgb(0 0 0 / 0.04)",
        lift: "0 12px 32px -12px rgb(0 0 0 / 0.18), 0 2px 6px rgb(0 0 0 / 0.04)",
      },
      borderRadius: { xl2: "0.875rem" },
    },
  },
  plugins: [],
};
export default config;
