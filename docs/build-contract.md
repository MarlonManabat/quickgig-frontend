# Build Contract

- npm with committed `package-lock.json`
- Node 20.x / npm 10.x engines are required
- `@` alias points to `src` in both `tsconfig.json` and `next.config.js`
- App Router APIs only; no duplicate routes between `pages/api` and `app/api`
- No TypeScript imports from `public/**`
- Required modules: `src/styles/globals.css`, `src/components/app/AppHeader.tsx`, `src/lib/env.ts`, `src/utils/supabaseClient.ts`, and data files under `src/data/**`
- Dependencies include `tailwindcss`, `postcss`, `autoprefixer`, `zod`, and `globby@^14` with named import
- `npm run ci:verify` checks these rules before build
