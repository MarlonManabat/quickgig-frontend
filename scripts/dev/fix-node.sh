#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

WANT="$(cat .nvmrc)"
echo "→ Ensuring Node ${WANT}"
if command -v volta >/dev/null 2>&1; then
  volta install "node@${WANT}" "npm@10.8.2"
elif command -v nvm >/dev/null 2>&1; then
  nvm install "${WANT}"
  nvm use "${WANT}"
else
  echo "Install Volta: curl https://get.volta.sh | bash"
fi

chmod -R +w node_modules 2>/dev/null || true
rm -rf node_modules package-lock.json
npm ci
echo "✔ Done."
