import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * robots.txt generat dinamic: indexăm tot site-ul public, excludem panoul
 * de administrare și referențiem sitemap-ul XML.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
