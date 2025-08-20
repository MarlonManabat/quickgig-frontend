#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-https://api.quickgig.ph}"
ADMIN="${ADMIN:-}"

echo "== Smoke /status =="
curl -sS "$BASE/status" | jq .

echo "== Install =="
curl -sS -i "$BASE/tools/install.php?token=RUN_ONCE" | sed -n '1,15p'

echo "== Seed event =="
slug="${SLUG:-launch-party}"
title="${TITLE:-Launch Party}"
venue="${VENUE:-Makati}"
start="${START_TIME:-2025-09-10 19:00:00}"
price="${PRICE:-5000}"
qty="${QTY:-100}"

if [[ -z "$ADMIN" ]]; then
  echo "Set ADMIN=<admin token> to seed admin endpoints." >&2
  exit 1
fi

curl -sS -X POST "$BASE/admin/events/create.php" \
 -H "X-Admin-Token: $ADMIN" -H "Content-Type: application/json" \
 --data "{\"slug\":\"$slug\",\"title\":\"$title\",\"venue\":\"$venue\",\"start_time\":\"$start\",\"status\":\"published\",\"tickets\":[{\"name\":\"GA\",\"price_cents\":$((price*100)),\"quantity_total\":$qty}]}" | jq . || true

echo "== Show event =="
curl -sS "$BASE/events/show.php?slug=$slug" | jq .
