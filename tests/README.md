# Test conventions
- **@smoke** — very fast checks; live in `tests/smoke/**`.
- **@slice** — finished vertical slice tests; tag the title with `@slice` when opting in later.
- **@wip** — work-in-progress; excluded from PR.

**PR runs**: `@smoke` only

**Full E2E**: everything (no filters)
