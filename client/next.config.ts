import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
    root: __dirname, 
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "miro.medium.com",
        port: "", 
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ssl.gstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
