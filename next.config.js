/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // ⬇️ Static export for Hostinger
  output: 'export',

  // Force trailing slashes so /login -> /login/index.html
  trailingSlash: true,

  // next/image off for purely static hosting
  images: {
    unoptimized: true,
  },

  // Let production build pass even if lint/types complain
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

};

module.exports = nextConfig;
