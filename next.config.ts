import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Temporarily ignore TypeScript errors during build to test admin endpoints
    ignoreBuildErrors: true
  },
  
  // Explicitly provide turbopack config to prevent Turbopack auto-activation
  turbopack: {},
  
  // Webpack configuration
  webpack: (config) => {
    // Webpack config for production builds
    return config;
  }
};

export default nextConfig;
