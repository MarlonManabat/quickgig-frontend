# Deploy flow (free-tier friendly)

## One-time Vercel settings
1. Project → **Git** → **Create Previews**: **None** (we create previews only via GitHub label `deploy`).
2. Project → **Git** → **Production Deployments**: **On for `main`** (optional if you prefer only hooks).
3. Project → **Deploy Hooks**:
   - Create **Production** hook → paste into `VERCEL_DEPLOY_HOOK_URL` (GitHub secret).
   - Create **Preview** hook → paste into `VERCEL_PREVIEW_HOOK_URL` (GitHub secret).

## Optional commit tag to skip
- Add `"[skip deploy]"` to the commit message to force-skip (docs-only etc).

## What gets deployed
- **Push to `main`** with app changes → Production via hook.
- **PR labeled `deploy`** → Preview via hook.
- Docs/CI/test-only changes → skipped by `scripts/ignore-build.js`.
