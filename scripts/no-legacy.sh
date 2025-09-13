#!/usr/bin/env bash
set -euo pipefail

# Find raw legacy paths
bad=$(rg -l '/find' src tests || true)
bad=$(echo "$bad" | grep -v 'src/app/lib/legacy-redirects.ts' | grep -v 'tests/smoke/legacy-redirects.spec.ts' | grep -v 'src/middleware.ts' || true)
if [[ -n "$bad" ]]; then
  echo 'Legacy path strings found in:'
  echo "$bad"
  exit 1
fi

# Check for legacy testIds
node "$(dirname "$0")/no-legacy.mjs"
