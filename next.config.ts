import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api-assets.clashroyale.com" },
      { protocol: "https", hostname: "royaleapi.github.io" },
      { protocol: "https", hostname: "static.royaleapi.com" },
    ],
  },
};

export default nextConfig;
