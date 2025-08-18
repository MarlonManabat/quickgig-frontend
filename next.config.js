const ENABLE_SECURITY = process.env.NEXT_PUBLIC_ENABLE_SECURITY_HEADERS === 'true';
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
];
const csp = "default-src 'self'; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.quickgig.ph; font-src 'self' data:; frame-ancestors 'self';";
securityHeaders.push({ key: 'Content-Security-Policy', value: csp });

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
    if (!ENABLE_SECURITY) return [];
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};
module.exports = nextConfig;
