# QuickGig Product Baseline (living)
> Single source of truth for shipped features, to avoid rework. Update in each feature PR.

## Core Architecture
- Frontend: Next.js App Router (Vercel)
- API: PHP (Hostinger) • Data/Auth/Storage: Supabase
- Domains: landing `quickgig.ph`, app `app.quickgig.ph`, api `api.quickgig.ph`

## Shipped (✅) / Partial (🟡) / Planned (🗂️)
- ✅ RSC guard: prevent hooks in Server Components (ESLint override)
- ✅ Applications page split: server wrapper + client UI
- ✅ CI toggle: Playwright smoke disabled by default (`RUN_SMOKE=false`)
- 🟡 Location dataset (PSGC): static dataset + GeoSelect — **recovered/in-progress**
- 🟡 Tickets/GCash gating: guard post flow, admin review queue (partially wired)
- 🟡 Messaging & notifications: working, harden + tests later
- 🗂️ Route unification: Landing & in-app “Post/Find” share same components
- 🗂️ Full E2E: run after product completion

## Feature IDs (reference these in PRs)
- FEAT-RSC-GUARD
- FEAT-APPL-CLIENT-SPLIT
- FEAT-CI-SMOKE-TOGGLE
- FEAT-PSGC-STATIC
- FEAT-TICKETS-GATE
- FEAT-ROUTE-UNIFY
- FEAT-MSG-NOTIFS

<!-- BACKFILL:START -->
### Backfilled history (auto, 2025-09-01)

#### FEAT-RSC-GUARD — RSC hook guard
| Date | Ref | Subject |
|------|-----|---------|
| 2025-08-31 | e96c0af | chore: scope RSC hook guard |
| 2025-08-31 | d22f059 | chore: add RSC lint guard and Applications smoke test |
| 2025-08-31 | 4973897 | fix(app): split applications page into server wrapper + client UI to resolve RSC hook violation |

#### FEAT-APPL-CLIENT-SPLIT — Applications page split
| Date | Ref | Subject |
|------|-----|---------|
| 2025-08-14 | bf20035 | feat(home): split client logic from page |

#### FEAT-CI-SMOKE-TOGGLE — CI smoke toggle
| Date | Ref | Subject |
|------|-----|---------|
| 2025-08-31 | #530 | Merge pull request #530 from MarlonManabat/codex/add-eslint-guard-and-playwright-smoke-test |
| 2025-08-31 | 99dd9f1 | docs: document RUN_SMOKE toggle |
| 2025-08-31 | #506 | Merge pull request #506 from MarlonManabat/codex/create-pr-to-disable-e2e-tests |
| 2025-08-30 | #498 | Merge pull request #498 from MarlonManabat/codex/fix-full-e2e-workflow-to-use-npm-install |
| 2025-08-30 | 91af2ee | fix(e2e): use `npm install` in Full E2E workflow to avoid lockfile drift breakages |
| 2025-08-30 | #491 | Merge pull request #491 from MarlonManabat/codex/create-npm-based-e2e-workflow-in-github-actions |
| 2025-08-30 | #489 | Merge pull request #489 from MarlonManabat/codex/fix-e2e-workflow-by-installing-pnpm-first |
| 2025-08-30 | c15ddc1 | ci(e2e): fix pnpm not found by installing pnpm before setup-node |
| 2025-08-30 | #488 | Merge pull request #488 from MarlonManabat/codex/replace-full-e2e-workflow-with-seed-aware-version |
| 2025-08-30 | 6f280ea | ci(e2e): replace Full E2E using existing envs; seed/cleanup tolerant; playwright artifacts |
| 2025-08-29 | #476 | Merge pull request #476 from MarlonManabat/codex/update-e2e-tests-for-app-host-ctas |
| 2025-08-29 | 51dd04b | test(e2e): align with app-host CTAs + inline post-job guard; reuse webServer |
| 2025-08-29 | #475 | Merge pull request #475 from MarlonManabat/codex/fix-e2e-port-clash-and-stabilize-baseurl |
| 2025-08-29 | 0cc001d | ci(e2e): reuse existing server on :3000 to avoid Playwright port clash; stabilize baseURL |
| 2025-08-29 | #474 | Merge pull request #474 from MarlonManabat/codex/add-playwright-e2e-tests-for-landing-and-app |
| 2025-08-27 | #435 | Merge pull request #435 from MarlonManabat/codex/enable-codex-self-healing-for-e2e-failures |
| 2025-08-27 | 4d64015 | feat: trigger Codex self-heal on e2e failures |
| 2025-08-27 | #421 | Merge pull request #421 from MarlonManabat/codex/fix-e2e-reliability-and-cli-errors |
| 2025-08-27 | 878a930 | feat(e2e): add stub auth and workflow reliability |
| 2025-08-26 | a5291ff | test(smoke): isolate stable checks; run strict flows in full e2e |
| 2025-08-26 | 0d3659a | ci: build app before smoke tests |
| 2025-08-26 | c560bf1 | ci: PRs run smoke only; full e2e manual; stop legacy PR E2E |
| 2025-08-26 | #417 | Merge pull request #417 from MarlonManabat/codex/fix-e2e-tests-and-improve-ci-speed |
| 2025-08-26 | ac3a2e5 | ci: add nightly full e2e workflow |
| 2025-08-26 | 27a7a4f | test(e2e): fix QA baseURL + parsing; stabilize smoke; gate SRK spec |
| 2025-08-26 | adaabb0 | test(e2e): skip service-role flows when key missing; fix request baseURL for QA API; stabilize CI |
| 2025-08-26 | 3f8a418 | ci: build once and shard e2e |
| 2025-08-26 | ac75f9f | fix(e2e): stabilize header/nav/profile + CI speedups |
| 2025-08-26 | ea6a0e9 | fix(ci/e2e): stub Stripe, relax service role in CI, add admin guard redirect, add profile-save test id |
| 2025-08-26 | 8e6aca7 | ci: run e2e against local server |

#### FEAT-PSGC-STATIC — Static PSGC dataset & GeoSelect
| Date | Ref | Subject |
|------|-----|---------|
| 2025-08-31 | #531 | Merge pull request #531 from MarlonManabat/codex/add-static-psgc-dataset-and-geoselect |
| 2025-08-31 | 800c0be | docs(psgc): note missing dataset |
| 2025-08-28 | #460 | Merge pull request #460 from MarlonManabat/codex/implement-regions-and-cities-update |
| 2025-08-28 | #457 | Merge pull request #457 from MarlonManabat/codex/add-full-psa-region/city-dataset |
| 2025-08-28 | 865cf12 | chore: expose PH locations dataset via public path |
| 2025-08-28 | 1fa4864 | feat: add full PH locations dataset and selector |
| 2025-08-26 | #415 | Merge pull request #415 from MarlonManabat/codex/fix-regions-dropdown-with-fallback |
| 2025-08-25 | #411 | Merge pull request #411 from MarlonManabat/codex/fix-loading-of-regions-and-cities |
| 2025-08-24 | #383 | Merge pull request #383 from MarlonManabat/codex/add-ph-regions-and-cities-registry |

#### FEAT-TICKETS-GATE — Tickets gating (3 free, ₱20 after)
| Date | Ref | Subject |
|------|-----|---------|
| 2025-08-31 | #529 | Merge pull request #529 from MarlonManabat/codex/add-withdraw-endpoint-and-ui |
| 2025-08-31 | 9783e46 | feat(applications): add withdraw flow |
| 2025-08-31 | #526 | Merge pull request #526 from MarlonManabat/codex/implement-withdraw-application-endpoint |
| 2025-08-31 | 40f121b | feat(applications): add withdrawal endpoint |
| 2025-08-31 | d6faa10 | feat(mvp): candidate dashboard — list & withdraw (stub); dynamic pages; mock-friendly; no tests |
| 2025-08-29 | 6a813e9 | feat: proxy gig creation to ticketing RPC |
| 2025-08-29 | #464 | Merge pull request #464 from MarlonManabat/codex/add-symmetric-ticket-model-and-api-routes |
| 2025-08-25 | #393 | Merge pull request #393 from MarlonManabat/codex/add-schema-changes-for-job-postings-and-tickets |
| 2025-08-25 | 564a523 | feat: add locations and ticket gating |
| 2025-08-24 | #385 | Merge pull request #385 from MarlonManabat/codex/implement-tickets-guardrails-and-agreements |
| 2025-08-24 | 370ef0f | feat(tickets-guardrails): add ledger, agreements, and wallet |
| 2025-08-24 | #376 | Merge pull request #376 from MarlonManabat/codex/add-gcash-integration-and-ticket-management |
| 2025-08-24 | 0495cb9 | feat: harden payments and tickets |
| 2025-08-23 | 1853f8c | feat: configure gcash payments and ticket freebies |
| 2025-08-23 | #355 | Merge pull request #355 from MarlonManabat/codex/add-end-to-end-tests-for-ticket-gating |
| 2025-08-23 | 72ca0a0 | test: add end-to-end for ticket gating |
| 2025-08-23 | #354 | Merge pull request #354 from MarlonManabat/codex/wire-up-ticket-balance-in-ui |
| 2025-08-23 | #353 | Merge pull request #353 from MarlonManabat/codex/add-ticketing-functionality-with-rls |
| 2025-08-23 | e954c1a | chore: rename ticket migration to 14-digit timestamp |
| 2025-08-23 | a880987 | feat: add ticket balance system |
| 2025-08-18 | #189 | Merge pull request #189 from MarlonManabat/codex/implement-application-details-and-withdraw-flow |

#### FEAT-GCASH-FLOW — GCash receipts & review
| Date | Ref | Subject |
|------|-----|---------|
| 2025-08-29 | #461 | Merge pull request #461 from MarlonManabat/codex/implement-posting-credits-and-gcash-proof |
| 2025-08-28 | 1bb232f | feat: add posting credits and manual gcash top-up |
| 2025-08-27 | #423 | Merge pull request #423 from MarlonManabat/codex/add-manual-gcash-top-up-feature |
| 2025-08-27 | fc39fb3 | feat(billing): add manual gcash top-up |
| 2025-08-24 | #373 | Merge pull request #373 from MarlonManabat/codex/implement-gcash-admin-review-features |
| 2025-08-23 | #370 | Merge pull request #370 from MarlonManabat/codex/implement-notifications-and-admin-gcash-review |
| 2025-08-23 | 4c6b092 | feat(notifications): in-app + email notifications for offers, hires, completions, and GCash approvals |
| 2025-08-23 | #367 | Merge pull request #367 from MarlonManabat/codex/add-manual-gcash-payments-feature |
| 2025-08-22 | #322 | Merge pull request #322 from MarlonManabat/codex/add-manual-gcash-paywall-feature |
| 2025-08-22 | 7fa2ecd | feat: add manual GCash paywall |
| 2025-08-22 | #298 | Merge pull request #298 from MarlonManabat/codex/create-branch-for-gcash-soft-launch-feature |
| 2025-08-19 | #221 | Merge pull request #221 from MarlonManabat/codex/switch-gcash-+-stripe-to-live-keys |

#### FEAT-ROUTE-UNIFY — Route unification (Landing ↔ App)
| Date | Ref | Subject |
|------|-----|---------|
| 2025-08-30 | #482 | Merge pull request #482 from MarlonManabat/codex/implement-landing-ctas-and-/create-page-changes |
| 2025-08-30 | 8a0ee11 | feat: centralize env-aware landing links |
| 2025-08-29 | #481 | Merge pull request #481 from MarlonManabat/codex/implement-landing-ctas-and-create-page |
| 2025-08-29 | 1d23347 | feat: centralize landing CTAs and create page |
| 2025-08-29 | a82be76 | feat: add landing CTAs to footer |
| 2025-08-29 | #479 | Merge pull request #479 from MarlonManabat/codex/eliminate-landing-cta-regressions |
| 2025-08-29 | dae906e | refactor landing CTAs to absolute app routes |
| 2025-08-29 | 3799083 | refactor: use absolute app links on landing |
| 2025-08-29 | fbae0af | test: cover landing links and post-job flow |
| 2025-08-29 | #473 | Merge pull request #473 from MarlonManabat/codex/fix-build-conflict-and-implement-landing-page-routing |
| 2025-08-29 | 3c12f3d | fix: remove stale marketing page imports; stabilize landing CTAs to app origin |
| 2025-08-29 | 9a223c7 | refactor: move landing to app router |
| 2025-08-29 | #469 | Merge pull request #469 from MarlonManabat/codex/implement-landing-page-updates |
| 2025-08-29 | #467 | Merge pull request #467 from MarlonManabat/codex/fix-landing-post-job-rpc-and-app-header |
| 2025-08-29 | a2b2f19 | test(landing): assert RPC function name is create_gig_public |
| 2025-08-29 | e505740 | fix: route nav and post job flow |
| 2025-08-25 | 5333478 | fix(auth): guard magic-link callback and unify landing login |
| 2025-08-24 | #390 | Merge pull request #390 from MarlonManabat/codex/fix-landing-ctas-for-app-routing |
| 2025-08-24 | 2be2de5 | fix(landing-cta): route Simulan na + Sign up to app start |
| 2025-08-24 | 1c21693 | test: guard canonical links on landing |
| 2025-08-24 | 930a7bd | chore: update landing CTA styling |
| 2025-08-24 | c25ec70 | feat(onboarding-routing): add role-based landing and dashboards |
| 2025-08-23 | ab66d1a | fix(routing+smoke): add app redirects (/find,/post,/jobs → /); keep landing CTAs/logo at APP_URL root; temporarily accept /find & /post in smoke |
| 2025-08-23 | #365 | Merge pull request #365 from MarlonManabat/codex/force-landing-ctas-to-app-root |
| 2025-08-23 | 100cb8f | feat(landing+app): force landing CTAs/logo to app root; add /post→/ redirect; relax smoke for Post CTA (temp) |
| 2025-08-23 | #364 | Merge pull request #364 from MarlonManabat/codex/force-landing-ctas-to-app-root-and-add-redirects |
| 2025-08-23 | 45d079e | fix(landing): force CTAs + logo to app root (absolute APP_URL) chore(app): redirects /find /login /signup -> / test(smoke): temporarily accept app root OR /find; increase timeouts; TODO root-only next PR |
| 2025-08-23 | 59cc588 | test(smoke): make landing CTAs role-agnostic and assert app redirect |
| 2025-08-23 | 6747012 | test(smoke): expect landing CTAs & logo to link to app root; use RegExp; update Taglish to \u201cMaghanap ng Trabaho\u201d |
| 2025-08-23 | #358 | Merge pull request #358 from MarlonManabat/codex/fix-landing-ctas-and-add-app-redirects |

#### FEAT-MSG-NOTIFS — Messaging & notifications
| Date | Ref | Subject |
|------|-----|---------|
| 2025-08-27 | #433 | Merge pull request #433 from MarlonManabat/codex/refactor-messages-create-api-for-type-safety |
| 2025-08-27 | 722b97b | fix(messages): type-safe API; remove brittle join; deterministic counterparty |
| 2025-08-27 | #430 | Merge pull request #430 from MarlonManabat/codex/implement-employer-management-and-notifications |
| 2025-08-23 | #371 | Merge pull request #371 from MarlonManabat/codex/fix-notifications-smoke-test-skipping-logic |
| 2025-08-23 | b4f3d81 | feat: make smoke notifications optional |
| 2025-08-23 | f84c8e4 | feat: add basic notification and profile updates |
| 2025-08-23 | #369 | Merge pull request #369 from MarlonManabat/codex/add-in-app-and-email-notifications |
| 2025-08-22 | da52807 | PR11 update: LinkSafe accepts anchor props (className, data-*); fix messages build; rename migration for lint |
| 2025-08-22 | 0ce1f34 | Wire messaging realtime and notifications |
| 2025-08-22 | #312 | Merge pull request #312 from MarlonManabat/codex/add-end-to-end-messaging-and-notifications |
| 2025-08-22 | 1634ce7 | feat: messaging thread and notifications |
| 2025-08-22 | d537686 | feat: add application thread components |
| 2025-08-22 | 353c511 | feat(reviews): enable post-hire ratings |
| 2025-08-22 | #290 | Merge pull request #290 from MarlonManabat/codex/implement-notifications-system-for-messages-and-offers |
| 2025-08-22 | 3c3f647 | feat: add notifications system |
| 2025-08-22 | #289 | Merge pull request #289 from MarlonManabat/codex/add-realtime-updates-for-message-threads |
| 2025-08-21 | 371f414 | feat: enable realtime message threads |
| 2025-08-21 | #288 | Merge pull request #288 from MarlonManabat/codex/add-messaging-and-offers-to-applications |
| 2025-08-21 | 28b2487 | feat(threads): application chat + offers/hires (RLS, Pages Router) |
| 2025-08-18 | #213 | Merge pull request #213 from MarlonManabat/codex/add-notifications-center-qa-harness |
| 2025-08-18 | 01bc885 | test(notify): add Notifications Center QA harness |
| 2025-08-18 | #200 | Merge pull request #200 from MarlonManabat/codex/implement-unified-notifications-center-tp47jh |
| 2025-08-18 | 534cce8 | feat(notifs): add unified notifications center (flagged) |
| 2025-08-18 | #197 | Merge pull request #197 from MarlonManabat/codex/implement-unified-notifications-center |
| 2025-08-18 | 77ca6bd | feat(notifs): add unified notifications center |
| 2025-08-18 | #174 | Merge pull request #174 from MarlonManabat/codex/add-in-app-toasts-and-webhook-for-messages |
| 2025-08-18 | 8a7229c | feat(notify+chat): toasts, webhook, chat polish |
| 2025-08-17 | #173 | Merge pull request #173 from MarlonManabat/codex/add-messages-mvp-features |
| 2025-08-17 | da0415d | feat(messages mvp): threads + API + UI |
| 2025-08-15 | 243dfa7 | feat: add optional email notifications |

<!-- BACKFILL:END -->
