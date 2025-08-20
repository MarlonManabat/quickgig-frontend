#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-https://api.quickgig.ph}"
curl -s "$BASE/status" | jq -e '.status=="ok"' >/dev/null

# public list should be JSON (200 or 204 if empty)
code=$(curl -s -o /tmp/_events.json -w '%{http_code}' "$BASE/events/index.php")
[[ "$code" =~ ^(200|204)$ ]] || (echo "events index code $code"; exit 1)
jq -e '.' /tmp/_events.json >/dev/null || true
echo "smoke ok"
