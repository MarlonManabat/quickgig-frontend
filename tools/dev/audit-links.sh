#!/usr/bin/env bash
set -euo pipefail
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <comma-separated-urls>"
  echo "Example: $0 https://quickgig.ph,https://app.quickgig.ph,https://preview-quickgig.vercel.app,https://preview-app.vercel.app"
  exit 2
fi
BASE_URLS="$1" \
node --unhandled-rejections=strict scripts/check-cta-links.mjs
