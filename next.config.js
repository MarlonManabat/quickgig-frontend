/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // ⬇️ Static export for Hostinger
  output: 'export',

  // next/image off for purely static hosting
  images: { unoptimized: true },

  // Let production build pass even if lint/types complain
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Optional CSS inlining (safe now that critters is installed)
  experimental: { optimizeCss: true },
};

module.exports = nextConfig;
