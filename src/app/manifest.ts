import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: "Home recipes, a week planner and a dice for when you can't decide.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFF8EE",
    theme_color: "#E4572E",
    categories: ["food", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Week planner", url: "/planner", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Roll the dice", url: "/random", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Markets", url: "/markets", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
