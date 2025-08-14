/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/app', permanent: true }];
  },
  async rewrites() {
    return [
      // HTML proxy for the product under /app
      { source: '/app/:path*', destination: 'https://app.quickgig.ph/:path*' },

      // ==== GLOBAL ASSET PROXY (UNCONDITIONAL) ====
      // Next/SPA assets
      { source: '/_next/:path*', destination: 'https://app.quickgig.ph/_next/:path*' },
      // Common static buckets used by the app
      { source: '/assets/:path*', destination: 'https://app.quickgig.ph/assets/:path*' },
      { source: '/static/:path*', destination: 'https://app.quickgig.ph/static/:path*' },
      { source: '/images/:path*', destination: 'https://app.quickgig.ph/images/:path*' },
      { source: '/img/:path*',    destination: 'https://app.quickgig.ph/img/:path*' },
      { source: '/fonts/:path*',  destination: 'https://app.quickgig.ph/fonts/:path*' },
      { source: '/media/:path*',  destination: 'https://app.quickgig.ph/media/:path*' },
      { source: '/uploads/:path*',destination: 'https://app.quickgig.ph/uploads/:path*' },
      // Root assets / meta
      { source: '/favicon.ico',      destination: 'https://app.quickgig.ph/favicon.ico' },
      { source: '/manifest.json',    destination: 'https://app.quickgig.ph/manifest.json' },
      { source: '/site.webmanifest', destination: 'https://app.quickgig.ph/site.webmanifest' },
      { source: '/robots.txt',       destination: 'https://app.quickgig.ph/robots.txt' },
      { source: '/sitemap.xml',      destination: 'https://app.quickgig.ph/sitemap.xml' },
    ];
  },
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};
module.exports = nextConfig;
