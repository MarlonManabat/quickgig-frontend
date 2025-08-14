/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/app', permanent: true }];
  },
  async rewrites() {
    return [
      // Existing proxy for the HTML itself
      { source: '/app/:path*', destination: 'https://app.quickgig.ph/:path*' },

      // --- Asset proxies (only when coming from /app) ---
      {
        source: '/_next/:path*',
        has: [{ type: 'header', key: 'referer', value: '.*\\/app.*' }],
        destination: 'https://app.quickgig.ph/_next/:path*',
      },
      {
        source: '/assets/:path*',
        has: [{ type: 'header', key: 'referer', value: '.*\\/app.*' }],
        destination: 'https://app.quickgig.ph/assets/:path*',
      },
      {
        source: '/static/:path*',
        has: [{ type: 'header', key: 'referer', value: '.*\\/app.*' }],
        destination: 'https://app.quickgig.ph/static/:path*',
      },
      {
        source: '/images/:path*',
        has: [{ type: 'header', key: 'referer', value: '.*\\/app.*' }],
        destination: 'https://app.quickgig.ph/images/:path*',
      },
      {
        source: '/fonts/:path*',
        has: [{ type: 'header', key: 'referer', value: '.*\\/app.*' }],
        destination: 'https://app.quickgig.ph/fonts/:path*',
      },
      {
        source: '/favicon.ico',
        has: [{ type: 'header', key: 'referer', value: '.*\\/app.*' }],
        destination: 'https://app.quickgig.ph/favicon.ico',
      },
      {
        source: '/manifest.json',
        has: [{ type: 'header', key: 'referer', value: '.*\\/app.*' }],
        destination: 'https://app.quickgig.ph/manifest.json',
      },
    ];
  },
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};
module.exports = nextConfig;
