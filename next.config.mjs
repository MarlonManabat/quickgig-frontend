/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/find',
        destination: '/browse-jobs',
      },
      {
        source: '/post-job',
        destination: '/gigs/create',
      },
    ];
  },
};

export default nextConfig;
