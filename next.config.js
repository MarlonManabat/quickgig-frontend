/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiTarget = process.env.API_BASE_URL;
    const rewrites = [
      {
        source: '/app/:path*',
        destination: 'https://app.quickgig.ph/:path*',
      },
    ];
    if (apiTarget)
      rewrites.push({ source: '/api/:path*', destination: `${apiTarget}/:path*` });
    return rewrites;
  },
  async redirects() {
    return [
      { source: '/', destination: '/app', permanent: false },
      {
        // NOTE: source must be a PATH, not a full URL
        source: '/:path*',
        has: [{ type: 'host', value: 'www.quickgig.ph' }],
        destination: 'https://quickgig.ph/:path*',
        permanent: false,
      },
    ];
  },
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};
module.exports = nextConfig;
