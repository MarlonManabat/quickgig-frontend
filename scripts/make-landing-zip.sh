#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
rm -f landing_public_html.zip
(cd landing_public_html && zip -r ../landing_public_html.zip .)
echo "Created landing_public_html.zip"
