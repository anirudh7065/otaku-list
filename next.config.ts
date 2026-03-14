import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        pathname: "/**",
      },{
        protocol: "https",
        hostname: "myanimelist.net",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  

};

export default nextConfig;
