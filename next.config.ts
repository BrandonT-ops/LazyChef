import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Recipes are read from content/recipes at runtime too (dynamic pages), so ship them with the server code.
  outputFileTracingIncludes: { "/**": ["./content/recipes/**"] },
  async headers() {
    return [
      {
        // The service worker must never be cached by the browser, so updates reach people.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
