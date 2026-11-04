import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Web app manifest (PWA basică): afișează numele/corespunzător în „Add to
 * Home Screen" și în motoarele de căutare care citesc manifestul.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.legalName} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: site.colors.primary,
    lang: "ro",
    dir: "ltr",
    categories: ["shopping", "health", "pets"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
