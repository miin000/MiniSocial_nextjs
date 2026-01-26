import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/uploads/:path*',
          destination: 'http://localhost:3001/api/v1/uploads/:path*',
        },
      ],
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
