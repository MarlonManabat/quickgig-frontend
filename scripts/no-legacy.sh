#!/usr/bin/env bash
set -euo pipefail
bad=$(git grep -nE "href=['\"]/(find|gigs|browsejobs|post-job|my-apps)['\"]" -- ':!tests/**' ':!landing_public_html/**' ':!legacy_pages_disabled/**' | grep -v '/gigs/create' || true)
if [[ -n "$bad" ]]; then
  echo "❌ Legacy paths detected in anchors:"
  echo "$bad"
  exit 1
fi
echo "✅ No legacy anchors found."
