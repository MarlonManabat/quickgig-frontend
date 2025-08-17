/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BUILD_TIME: new Date().toISOString(),
  },
  async redirects() {
    return [
      { source: '/_legacy-diag', destination: '/legacy-diag', permanent: false },
    ];
  },
};
module.exports = nextConfig;
