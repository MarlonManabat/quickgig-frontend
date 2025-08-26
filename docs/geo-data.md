# Geo data fallback

The Region/Province/City selectors load data in tiers with a 2.5s timeout per tier:

1. **Supabase** – direct fetch if `NEXT_PUBLIC_SUPABASE_URL` is configured and tables exist.
2. **API Route** – `/api/geo/*` proxies to Supabase with the same timeout.
3. **Static JSON** – checked-in fallback under `public/geo/ph/*.json`.

Each tier is attempted in order until one succeeds. Warnings for failures are throttled so the console logs at most once per tier.

## Refreshing static data

Static JSON files provide a minimal Philippines dataset so the landing build works even without Supabase access or when CORS blocks requests. To refresh:

1. Pull updated records from Supabase.
2. Overwrite the JSON in `public/geo/ph/` and commit.

The landing site uses these files directly, ensuring regions appear within ~2–3s even offline.

## Supabase seed

If the geo tables exist, seed them using the migration under `supabase/migrations/*_geo_seed_audit.sql`. The migration uses UPSERTs so it is safe to re-run.
