import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Keep production checks separate from an open development server.
  distDir: process.env.NODE_ENV === "production" ? ".next-production" : ".next",
  async redirects() {
    return [
      { source: "/products/:path*", destination: "/stays", permanent: true },
      { source: "/table", destination: "/stays", permanent: true },
    ];
  },
};
export default nextConfig;
