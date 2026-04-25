import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ['yt-search', 'cheerio'],
  },
};

export default nextConfig;
