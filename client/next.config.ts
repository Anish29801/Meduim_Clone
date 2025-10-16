import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["miro.medium.com"], // ✅ allow Medium-hosted images
  },
};

export default nextConfig;
