/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },        // prevent CI failing on eslint/parser fetch
};
module.exports = nextConfig;
