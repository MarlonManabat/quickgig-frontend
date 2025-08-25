#!/usr/bin/env bash
set -euo pipefail
echo "Node: $(node -v)"; echo "npm : $(npm -v)"
if npm ci --ignore-scripts --no-audit --no-fund; then
  echo "npm ci ok"
else
  echo "::warning:: npm ci failed; healing with npm@9"
  npx -y npm@9 install --package-lock-only --no-audit --no-fund || true
  npm install --ignore-scripts --no-audit --no-fund
fi
npm rebuild --no-audit --no-fund || true
npm run -s postinstall || true

