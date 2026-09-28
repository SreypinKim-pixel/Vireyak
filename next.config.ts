import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Vercel expects .next; isolate local production checks from next dev.
  distDir:
    process.env.NODE_ENV === "production" && process.env.VERCEL !== "1"
      ? ".next-production"
      : ".next",
  async redirects() {
    return [
      { source: "/products/:path*", destination: "/stays", permanent: true },
    ];
  },
};
export default nextConfig;
