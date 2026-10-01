/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@katl/shared-types', '@katl/database', '@katl/redis'],
  experimental: {
    // Optimizations
  },
};

export default nextConfig;
