import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@skyprompt/js"],
  webpack: (config, { }) => {
    return config;
  },
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false
  }
};

export default nextConfig;
