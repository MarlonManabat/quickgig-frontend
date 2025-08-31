# Build Contract

- **Engines**: Node 20.x, npm 10.x (local, CI, and Vercel).
- **Lockfile**: Always commit `package-lock.json`. When deps change, run `npm install` locally to regenerate (not `npm ci`).
- **Install phase (CI)**: `npm ci --include=dev` with `NODE_ENV=development`. Only set `NODE_ENV=production` for `next build`.
- **Required dev deps**: `tailwindcss`, `postcss`, `autoprefixer`, `globby`, `zod`.
- **Aliases**: `@` maps to `src/` in tsconfig and webpack. No imports from `public/**`.
- **E2E gating**: Preflight (`ci:verify`, `typecheck`), build, run server, wait on `/api/health`, seed via `/api/e2e/seed` (script fallback), run Playwright, upload artifacts.
