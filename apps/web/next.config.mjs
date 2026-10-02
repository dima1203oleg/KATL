/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@katl/shared-types', '@katl/database', '@katl/redis'],
  async redirects() {
    return [
      { source: '/ua', destination: '/uk-UA', permanent: true },
      { source: '/ua/:path*', destination: '/uk-UA/:path*', permanent: true },
      { source: '/uk', destination: '/uk-UA', permanent: true },
      { source: '/uk/:path*', destination: '/uk-UA/:path*', permanent: true },
      { source: '/zh-Hans', destination: '/zh-CN', permanent: true },
      { source: '/zh-Hans/:path*', destination: '/zh-CN/:path*', permanent: true },
    ];
  },
  experimental: {
    // Optimizations
  },
};

export default nextConfig;
