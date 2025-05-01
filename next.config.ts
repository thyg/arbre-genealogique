import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://85.214.142.178:8030/api/:path*"
      }
    ];
  }
};

export default nextConfig;
