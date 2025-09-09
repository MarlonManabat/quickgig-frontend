---
title: QuickGig Status Snapshot
tags: [status, contract, snapshot]
---

# Status — 2025-09-09

## What must stay true (current contract)
- **Canonical app routes:** **/browse-jobs**, **/post-job**, **/applications**, **/login**  
- **Legacy redirects accepted:** **/post-jobs** and **/gigs/create** must redirect to **/post-job**
- **Auth-aware:** Signed-out flows that land on **/login?next=<dest>** are considered **success** in smoke

## Notes
- This snapshot is generated automatically by CI and intended to reflect the repository’s **current invariants** enforced by tests and guardrails.
- If this contradicts real behavior, fix the product/tests and re-run the snapshot.
