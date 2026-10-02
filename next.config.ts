import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict React mode for catching potential issues early
  reactStrictMode: true,

  outputFileTracingIncludes: {
    "/**": ["./node_modules/pg-cloudflare/dist/**/*"],
  },

  // Security headers will be added in production phases
  // images: { remotePatterns: [] },  // configure when file uploads are added
};

export default nextConfig;
