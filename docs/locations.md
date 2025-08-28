# PH Locations

Data sourced from the Philippine Statistics Authority PSGC. Snapshot date: 2023-09-01.

## Full seed

Place CSVs at `data/psgc/{regions,provinces,cities}.csv` and run:

```
SUPABASE_SERVICE_ROLE=... node scripts/seed-ph-locations.ts
```

## NCR

The National Capital Region is represented with a synthetic province record `code='NCR'` so the UI always shows a province step.

## Endpoints

- `GET /api/locations/health` – returns JSON `{ ok, ncrCityCount, province, region }` and is used by CI to verify the NCR dataset.
- `POST /api/locations/repair` – idempotently upserts the full NCR city list. Requires header `x-self-heal: <SELF_HEAL_TOKEN>`.

## Self-heal

CI calls the health endpoint after deploy. If `ok=false` it dispatches the self-heal workflow which:
1. POSTs to `/api/locations/repair` with `SELF_HEAL_TOKEN`.
2. Re-checks `/api/locations/health`.
3. Re-runs the QA workflow.

Ensure `SELF_HEAL_TOKEN` is configured in Vercel project settings and as a GitHub Actions secret. Previews and production must point to the correct Supabase project so the health check counts NCR cities accurately.
