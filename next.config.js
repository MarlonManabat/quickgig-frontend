/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },        // prevent CI failing on eslint/parser fetch
  experimental: { appDir: false }              // enforce Pages Router
};
module.exports = nextConfig;
