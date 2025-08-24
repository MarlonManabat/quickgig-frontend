const redirects = async () => ([
  { source: '/post', destination: '/', permanent: false },
  { source: '/find', destination: '/', permanent: false }, // TEMP until cache settles
  { source: '/jobs', destination: '/', permanent: false }, // just in case
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true }, // prevent CI failing on eslint/parser fetch
  async redirects() {
    const base = await redirects();
    return [
      ...base,
      { source: '/login', destination: '/', permanent: true },
      { source: '/signup', destination: '/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
