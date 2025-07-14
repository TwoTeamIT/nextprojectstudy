import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //output: "standalone",
  compress: false,
  reactStrictMode: false,
  images: {
    domains: ['flagcdn.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/w40/**',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
    incomingRequests: true,
  }
};

export default nextConfig;
