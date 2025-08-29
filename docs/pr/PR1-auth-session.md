# PR1 — Fix Supabase Auth Loop & Stable Sessions

**Summary**
- Adds `middleware.ts` to refresh sessions using `@supabase/auth-helpers-nextjs`
- Creates `/api/auth/callback` to exchange magic-link code for a session, then redirect via `?next=`
- Uses shared cookie domain `.quickgig.ph` for cross-subdomain sign-in (Hostinger landing + Vercel app)
- Updates sign-in to use `NEXT_PUBLIC_SITE_URL/api/auth/callback`

**Env (Vercel Project → Settings → Environment Variables)**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, not used in this PR but required later)
- `NEXT_PUBLIC_SITE_URL=https://app.quickgig.ph`
- `SUPABASE_AUTH_COOKIE_DOMAIN=.quickgig.ph`

**Supabase Auth Redirects (Dashboard → Authentication → URL Configuration)**
- Add: `https://app.quickgig.ph/api/auth/callback`
- (Optionally) `https://app.quickgig.ph/*` or wildcard as supported.

**Testing (manual)**
1. Sign up or sign in with magic link.
2. Click email link → lands on `/api/auth/callback` → redirected to `/` in an authenticated state.
3. Refresh browser and navigate: session persists.
4. From `quickgig.ph` landing, open app and confirm still signed in.

**Notes**
- No SSR breakage; middleware guards static assets.
- No visual changes beyond error page.
