import { test, expect } from '@playwright/test';
import { toRegionOptions, PH_REGIONS } from '../../src/lib/geo/regions';

test('Location dataset exposes all PH regions', async () => {
  const opts = toRegionOptions();
  expect(opts.length).toBe(17);
  expect(opts.map(o => o.label)).toContain('Metro Manila');
  expect(opts.length).toBe(PH_REGIONS.length);
});
