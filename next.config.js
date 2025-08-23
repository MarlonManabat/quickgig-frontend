/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },        // prevent CI failing on eslint/parser fetch
  async redirects() {
    return [
      { source: '/login', destination: '/', permanent: true },
      { source: '/signup', destination: '/', permanent: true },
      { source: '/find', destination: '/', permanent: true },
    ];
  },
};
module.exports = nextConfig;
