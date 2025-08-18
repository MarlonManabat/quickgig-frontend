/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://app.quickgig.ph/:path*',
        permanent: true, // use 308 on Vercel
      },
    ];
  },
};

module.exports = nextConfig;
