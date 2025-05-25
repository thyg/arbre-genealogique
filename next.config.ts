import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://157.90.26.3:8032/api/:path*"
      }
    ];
  }
};

export default nextConfig;
