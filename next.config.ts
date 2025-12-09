import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Make output configurable so we can disable static export in SSR builds (e.g., Amplify)
  ...(process.env.NEXT_OUTPUT ? { output: process.env.NEXT_OUTPUT as 'export' | 'standalone' } : {}),
};

export default nextConfig;
