import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "miro.medium.com",
        pathname: "/**", // allow all paths from this domain
      },
    ],
  },
};

export default nextConfig;
