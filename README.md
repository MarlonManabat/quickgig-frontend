# QuickGig Frontend

A Next.js application for QuickGig.ph configured for deployment on Vercel.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and adjust as needed. The app
   defaults to the public API if the variable is missing:
   ```env
   NEXT_PUBLIC_API_URL=https://api.quickgig.ph
   ```

## Authentication

The app communicates with an external API using the `/src/lib/api.ts` helper. When `auth` is set on a request, a JWT token stored in `localStorage` is sent in the `Authorization` header. If the backend issues HttpOnly cookies, they are included automatically.

Tokens are managed through `/src/lib/auth.ts`, and basic route protection is available via `/src/lib/withAuth.tsx`.

## Development

Run the development server and visit
[http://localhost:3000/health-check](http://localhost:3000/health-check):

```bash
npm run dev
```

## Deployment

Deployment is handled via the Vercel GitHub integration. Ensure the
`NEXT_PUBLIC_API_URL` environment variable is set in your Vercel project
settings.

Login, signup, and other protected pages call the external API at
`https://api.quickgig.ph`; this Next.js app does not provide any API routes.

### Health check

Production API base:

```bash
NEXT_PUBLIC_API_URL=https://api.quickgig.ph
```

Smoke test the live API:

```bash
BASE=https://api.quickgig.ph npm run check:api
```

Preview the UI health page at `/health-check`.

CI uses the soft variant (`npm run check:api:soft`).
