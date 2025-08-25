#!/usr/bin/env bash
set -euo pipefail

echo "Node: $(node -v)"
echo "npm : $(npm -v)"

# Prefer strict install, but heal if lock is out-of-sync.
if npm ci --ignore-scripts --no-audit --no-fund; then
  echo "npm ci succeeded"
else
  echo "::warning:: npm ci failed; falling back to safe heal"
  # Heal the lock for this CI run without committing any files.
  # Use npm@9 to match lockfile v2 semantics if present.
  npx -y npm@9 --version || true
  npx -y npm@9 install --package-lock-only --no-audit --no-fund || true
  npm install --ignore-scripts --no-audit --no-fund
fi

# Now run postinstall scripts (Playwright etc.) only after deps are present
npm rebuild --no-audit --no-fund || true
npm run -s postinstall || true
