const enableSecurity =
  String(process.env.NEXT_PUBLIC_ENABLE_SECURITY_AUDIT || 'false').toLowerCase() ===
  'true';

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
  async headers() {
    if (!enableSecurity) return [];
    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'",
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      { key: 'X-Frame-Options', value: 'DENY' },
    ];
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
