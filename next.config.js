/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  async redirects() {
    return [
      // Catch legacy /app paths and send them to the root app
      { source: '/app', destination: '/', permanent: true },
      { source: '/app/:path*', destination: '/:path*', permanent: true },
    ];
  },
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
