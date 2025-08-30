const path = require('path');

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  eslint: { ignoreDuringBuilds: true }, // prevent CI failing on eslint/parser fetch
  // Guard: don’t accidentally opt routes into Edge when using Supabase helpers.
  experimental: {
    forceSwcTransforms: true,
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    // Ensure woff/woff2 are always handled as assets when imported by css.
    config.module.rules.push({
      test: /\.(woff|woff2)$/i,
      type: "asset/resource",
      generator: { filename: "static/fonts/[name][ext]" },
    });
    if (process.env.CI === 'true' || process.env.DISABLE_STRIPE === '1') {
      config.resolve.alias['stripe'] = path.resolve(__dirname, 'stubs/stripe.js');
    }
    return config;
  },
  async headers() {
    return [
      {
        source:
          "/:path*{.js,.css,.woff2,.png,.jpg,.jpeg,.gif,.svg,.webp,.avif}",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon-:size.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // legacy to canonical
      { source: "/post", destination: "/posts", permanent: true },
      { source: "/finds", destination: "/find", permanent: true },
      {
        source: "/simulan",
        destination: "/start?intent=worker",
        permanent: true,
      },
      { source: "/signup", destination: "/start", permanent: true },
      {
        source: "/start-worker",
        destination: "/start?intent=worker",
        permanent: true,
      },
      {
        source: "/start-employer",
        destination: "/start?intent=employer",
        permanent: true,
      },
      { source: "/post-job", destination: "/post", permanent: true },
      { source: "/gigs/new", destination: "/post", permanent: true },
      { source: "/jobs", destination: "/find", permanent: true },
      { source: "/jobs/:path*", destination: "/find", permanent: true },
      { source: "/work", destination: "/find", permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: "/employer/post", destination: "/post" },
      { source: "/jobs/post", destination: "/post" },
    ];
  },
};

const withAnalyzer =
  process.env.ANALYZE === "true"
    ? require("@next/bundle-analyzer")({ enabled: true })
    : (cfg) => cfg;

module.exports = withAnalyzer(baseConfig);
