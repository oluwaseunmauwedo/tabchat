import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uncommon-guanaco-317.convex.cloud",
        pathname: "/api/storage/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      "@imageflow/convex": path.resolve(__dirname, "../../convex"),
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@imageflow/convex": path.resolve(__dirname, "../../convex"),
    };
    return config;
  },
};

export default nextConfig;
