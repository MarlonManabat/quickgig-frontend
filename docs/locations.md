# PH Locations

Data sourced from the Philippine Statistics Authority PSGC. Snapshot date: 2023-09-01.

## Full seed

Place CSVs at `data/psgc/{regions,provinces,cities}.csv` and run:

```
SUPABASE_SERVICE_ROLE=... node scripts/seed-ph-locations.ts
```

## NCR

The National Capital Region is represented with a synthetic province record `code='NCR'` so the UI always shows a province step.
