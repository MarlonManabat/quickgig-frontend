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
  async headers() {
    if (process.env.NEXT_PUBLIC_ENABLE_SECURITY_HEADERS === 'true') {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            {
              key: 'Permissions-Policy',
              value: 'geolocation=(), microphone=(), camera=()',
            },
            {
              key: 'Content-Security-Policy',
              value:
                "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.quickgig.ph https://*.amazonaws.com; font-src 'self' data:;", // CSP may need tuning per deployment
            },
          ],
        },
      ];
    }
    return [];
  },
};
module.exports = nextConfig;
