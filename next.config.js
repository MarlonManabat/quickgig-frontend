/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const target = process.env.API_BASE_URL;
    return target ? [{ source: '/api/:path*', destination: `${target}/:path*` }] : [];
  },
  async redirects() {
    return [
      {
        // NOTE: source must be a PATH, not a full URL
        source: '/:path*',
        has: [{ type: 'host', value: 'www.quickgig.ph' }],
        destination: 'https://quickgig.ph/:path*',
        permanent: true,
      },
    ];
  },
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};
module.exports = nextConfig;
