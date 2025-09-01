# No-Rework Checklist (run before opening a PR)
- Did I check `docs/product/BASELINE.md` and reference a Feature ID?
- Am I re-adding API calls already replaced by static PSGC (FEAT-PSGC-STATIC)?
- For app router pages: Server files have **no hooks**; hook code lives in a `'use client'` child.
- If adding routes/buttons already existing on landing/app, am I reusing the shared component (FEAT-ROUTE-UNIFY)?
