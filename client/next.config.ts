import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const clientRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: clientRoot,
  },
  allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
  images: {
    remotePatterns: [
      // Backblaze B2 CDN
      { protocol: "https", hostname: "*.backblazeb2.com" },
      { protocol: "https", hostname: "f*.backblazeb2.com" },
      // Vercel Blob (existing site_logo)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Placeholder images (dev only)
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "3dkj7nxtnweewnby.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
