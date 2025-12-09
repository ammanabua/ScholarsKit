import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Make output configurable so we can disable static export in SSR builds (e.g., Amplify)
  output: 'standalone'
};

export default nextConfig;
