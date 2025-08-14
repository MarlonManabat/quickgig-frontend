/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Canonicalize root to the live product
      { source: '/', destination: 'https://app.quickgig.ph', permanent: true },
      // Safety: also catch any lingering /app usages
      { source: '/app/:path*', destination: 'https://app.quickgig.ph/:path*', permanent: true },
      { source: '/app', destination: 'https://app.quickgig.ph', permanent: true },
    ];
  },
  // No rewrites needed anymore.
  async rewrites() { return []; },
};
module.exports = nextConfig;
