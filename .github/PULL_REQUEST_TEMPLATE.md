## Why (context + intent)
- Goal: <what this change moves us toward in the product milestone>
- User impact: <what improves for workers/employers/admins>
- Scope: <what’s in / what’s explicitly out>

## What changed (summary)
- <bullet list of concrete edits>

## Lessons applied from previous tasks
- <What went wrong before + what we’re doing differently now>
- <Alignment with repo conventions (package manager, env names, CI patterns)>

## Risks & mitigations
- Risks: <behavioral/infra/test>
- Mitigations: <gates, fallbacks, feature flags>

## Validation plan
- Local: <commands run>
- CI: <which workflows should go green + artifacts to check>
- Manual: <quick checklist to smoke the feature>

## Rollback plan
- <simple steps to revert / safe toggles>

---

### Checklist (must-keep)
- [ ] Uses the project’s package manager per lockfile (npm vs pnpm)
- [ ] Re-uses existing env names (no new secrets unless required)
- [ ] Seeds/cleans test data deterministically (if tests touch data)
- [ ] Always uploads Playwright/Next logs on failure
- [ ] Adds/updates docs or comments if behavior changes
