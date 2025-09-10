import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
await jiti.import("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@instello/ui", "@instello/db", "@instello/api"],
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "image.mux.com",
      },
    ],
  },
};

export default nextConfig;
