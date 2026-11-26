import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    unoptimized: true,
    // Imaginile urcate din panou sunt găzduite de Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  experimental: {
    // Upload de imagine în formularul de produs (implicit Next permite doar 1 MB).
    serverActions: { bodySizeLimit: "5mb" },
  },
  // Cataloagele locale rămân disponibile în funcțiile Vercel ca fallback când
  // Vercel Blob nu e încă configurat sau nu are încă un catalog salvat.
  outputFileTracingIncludes: {
    "/*": [
      "./scrape/products.json",
      "./scrape/carnilove_products.json",
      "./scrape/ekoprom_products.json",
      "./scrape/natura_products.json",
      "./scrape/econatura_products.json",
      "./scrape/farmavet_products.json",
    ],
  },
};

export default nextConfig;
