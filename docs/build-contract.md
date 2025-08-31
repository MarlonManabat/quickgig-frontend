# Build Contract

- **Engines:** Node 20.x, npm 10.x across local, CI, and Vercel.
- **Lockfile:** Always commit `package-lock.json`. If dependencies change, run `npm install` locally to regenerate.
- **Install phase in CI:** Use `npm ci --include=dev` with `NODE_ENV=development`; only set `NODE_ENV=production` for `next build`.
- **Required dev deps:** `tailwindcss`, `postcss`, `autoprefixer`, `globby`, `zod` must be present.
- **Pathing:** `@` alias points to `src/` consistently in TS & webpack. No imports from `public/**`.
- **App health & seeding:** E2E waits on `/api/health`; seeds via `/api/e2e/seed` with script fallback.
- **Artifacts:** Always upload Playwright report and Next server log.

