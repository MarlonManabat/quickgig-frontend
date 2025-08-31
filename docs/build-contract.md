# Build Contract

- **Engines**: Node 20.x, npm 10.x (local, CI, Vercel).
- **Lockfile**: Always commit `package-lock.json`. When deps change, run `npm install` locally to regenerate (not `npm ci`).
- **Install (CI)**: `npm ci --include=dev` with `NODE_ENV=development`. Use `NODE_ENV=production` only for `next build`.
- **Required dev deps**: `tailwindcss`, `postcss`, `autoprefixer`, `globby`, `zod`.
- **Aliases**: `@` → `src/` in tsconfig + webpack. **No imports** from `public/**`.
- **E2E gating**: `ci:verify` → `typecheck` → build → run server → wait on `/api/health` → seed via `/api/e2e/seed` (script fallback) → run Playwright → upload artifacts.
