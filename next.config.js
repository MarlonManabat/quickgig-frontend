/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BUILD_TIME: new Date().toISOString(),
  },
  experimental: {
    serverComponentsExternalPackages: ['@aws-sdk/client-s3','@aws-sdk/s3-request-presigner'],
  },
  async redirects() {
    return [
      { source: '/_legacy-diag', destination: '/legacy-diag', permanent: false },
    ];
  },
};
module.exports = nextConfig;
