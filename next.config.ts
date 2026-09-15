import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "brit-petfood.com",
        pathname: "/file/**",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        pathname: "/wxpwprc19ca5/**",
      },
    ],
  },
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
