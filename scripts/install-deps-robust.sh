#!/usr/bin/env bash
set -euxo pipefail
npm config set audit false
npm config set fund false
npm config set progress false
npm config set prefer-offline true
npm config set cache "${HOME}/.npm"
for i in 1 2 3 4; do
  echo "npm ci attempt $i"
  if npm ci --no-audit --no-fund; then
    echo "npm ci succeeded"
    exit 0
  fi
  if [ "$i" -eq 4 ]; then
    echo "npm ci failed after $i attempts" >&2
    exit 1
  fi
  sleep $((i*20))
done
