/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },        // prevent CI failing on eslint/parser fetch
  async redirects() {
    return [
      { source: '/find', destination: '/', permanent: true },
      { source: '/post', destination: '/', permanent: false },
      { source: '/login', destination: '/', permanent: true },
      { source: '/signup', destination: '/', permanent: true },
    ];
  },
};
module.exports = nextConfig;
