#!/usr/bin/env bash
set -euo pipefail

if grep -R "\/find" app components >/dev/null 2>&1; then
  echo "Legacy path /find detected" >&2
  exit 1
fi

echo "Legacy path check passed."
