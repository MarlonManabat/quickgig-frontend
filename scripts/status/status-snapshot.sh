#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/status/status-snapshot.sh [YYYY-MM-DD]
DATE="${1:-$(date -u +%F)}"
DOCS_DIR="docs/status"
SNAPSHOT_FILE="${DOCS_DIR}/status-${DATE}.md"
LATEST_FILE="${DOCS_DIR}/latest.md"

mkdir -p "${DOCS_DIR}"

cat > "${SNAPSHOT_FILE}" <<'MD'
---
title: QuickGig Status Snapshot
tags: [status, contract, snapshot]
---

# Status — ${DATE}

## What must stay true (current contract)
- **Canonical app routes:** **/browse-jobs**, **/post-job**, **/applications**, **/login**  
- **Legacy redirects accepted:** **/post-jobs** and **/gigs/create** must redirect to **/post-job**
- **Auth-aware:** Signed-out flows that land on **/login?next=<dest>** are considered **success** in smoke

## Notes
- This snapshot is generated automatically by CI and intended to reflect the repository’s **current invariants** enforced by tests and guardrails.
- If this contradicts real behavior, fix the product/tests and re-run the snapshot.
MD

# Interpolate the date into the snapshot (portable)
sed -i.bak "s/\${DATE}/${DATE}/g" "${SNAPSHOT_FILE}" && rm -f "${SNAPSHOT_FILE}.bak"

# Keep a readable pointer for the GH summary and for humans
cp -f "${SNAPSHOT_FILE}" "${LATEST_FILE}"

echo "Wrote ${SNAPSHOT_FILE} and updated ${LATEST_FILE}"

