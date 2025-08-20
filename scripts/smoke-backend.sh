#!/usr/bin/env bash
set -euo pipefail
BASE=${BASE:-https://api.quickgig.ph}

echo "== /status =="
curl -sSf "$BASE/status" | jq .

echo "== /events =="
curl -sSf "$BASE/events/index.php" | jq . | head -n 50
