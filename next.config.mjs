const enableSecurity =
  String(process.env.NEXT_PUBLIC_ENABLE_SECURITY_AUDIT || 'false').toLowerCase() ===
  'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    const rules = [
      // quickgig.ph → app.quickgig.ph
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'quickgig.ph' }],
        destination: 'https://app.quickgig.ph/:path*',
        permanent: true,
      },
      // www.quickgig.ph → app.quickgig.ph
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.quickgig.ph' }],
        destination: 'https://app.quickgig.ph/:path*',
        permanent: true,
      },
    ];

    return [...rules];
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

export default nextConfig;
