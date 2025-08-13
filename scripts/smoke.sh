#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE_URL:-https://quickgig.ph}"
curl -sSf "$BASE" >/dev/null
curl -sS "$BASE/login" | head -n 1 >/dev/null

API="${API_URL:-https://api.quickgig.ph}"
curl -sSf "$API/health" >/dev/null
echo "Smoke OK: $BASE & $API"
