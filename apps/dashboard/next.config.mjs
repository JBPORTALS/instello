/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@instello/ui"],
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
