import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fbrentals.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    const target = process.env.NEXT_PUBLIC_APP_URI || "http://localhost:4005";
    return [
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
