# PR2 - PH Locations dataset and component

## Summary
- Add full PSA dataset of regions and cities.
- Introduce `<LocationSelect />` for region/city dropdowns.

## Changes
- `data/ph_locations.json` with 17 regions and 149 cities.
- Reusable `components/LocationSelect` component.
- Post Job and Find Work forms now use `LocationSelect` and submit `region_code`/`city_code`.
- Supabase migration for `regions` and `cities` tables with RLS.
- Smoke test ensuring locations JSON loads and NCR cities > 10.

## Testing
- `npm run lint`
- `npm run typecheck`
- `npm run test:smoke`

## Acceptance
- Region dropdown lists all PH regions.
- City dropdown filters based on selected region.
- Forms send `region_code` and `city_code`.

## Notes
- Full PSA dataset included.
