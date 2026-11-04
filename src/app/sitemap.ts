import type { MetadataRoute } from "next";
import { getProducts } from "@/data/productCatalog.server";
import { site } from "@/lib/site";

/**
 * Sitemap XML generat dinamic: paginile statice plus fiecare produs din
 * catalog, cu imaginea principală atașată (image sitemap, conform
 * developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/produse`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/instrumente`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${site.url}/instrumente/calculator-hrana`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/instrumente/nivel-sanatate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/instrumente/recomandare-produse`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const productPages: MetadataRoute.Sitemap = getProducts().map((product) => ({
    url: `${site.url}${product.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
    images: [`${site.url}${product.image}`],
  }));

  return [...staticPages, ...productPages];
}
