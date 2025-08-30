# scripts/

- Script code runs in CI or locally only; **never** imported by the app.
- We isolate TypeScript config via `scripts/tsconfig.json` so Vercel preview builds are unaffected.
- CI seeds **via API first** (`/api/e2e/seed` with optional `E2E_KEY`) and falls back to `scripts/seed-demo.ts` if needed.
