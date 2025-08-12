#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE_URL:-https://quickgig.ph}"
curl -sSf "$BASE" >/dev/null
curl -sS "$BASE/login" | head -n 1 >/dev/null
echo "Smoke OK: $BASE"
