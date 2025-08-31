# Test conventions
- **@smoke** — very fast checks; live in `tests/smoke/**`.
- **@slice** — finished vertical slice tests; put `@slice` in the test title *or* name the file `*slice*.spec.ts`.
- **@wip** — work-in-progress; excluded from PR.

**PR runs**: `@smoke` + `@slice` (and anything with `slice`/`finished` in filename)

**Full E2E**: everything (no filters)
