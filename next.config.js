const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  eslint: { ignoreDuringBuilds: true }, // prevent CI failing on eslint/parser fetch
  async headers() {
    return [
      {
        source:
          '/:path*{.js,.css,.woff2,.png,.jpg,.jpeg,.gif,.svg,.webp,.avif}',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/favicon-:size.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  async redirects() {
    return [];
  },
});
