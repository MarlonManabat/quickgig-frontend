/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/app', permanent: true }];
  },
  async rewrites() {
    return [{ source: '/app/:path*', destination: 'https://app.quickgig.ph/:path*' }];
  },
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};
module.exports = nextConfig;
