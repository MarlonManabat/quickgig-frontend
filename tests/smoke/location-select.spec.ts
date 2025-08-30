import { test, expect } from '@playwright/test';
import React from 'react';
import { renderToString } from 'react-dom/server';
import LocationSelect from '../../components/location/LocationSelect';

function countRegionOptions(html: string) {
  const match = html.match(/data-testid="region-select"[^>]*>([\s\S]*?)<\/select>/);
  if (!match) return 0;
  const options = match[1].match(/<option/g) || [];
  return Math.max(0, options.length - 1); // minus placeholder
}

test('LocationSelect renders full region list', async () => {
  const html = renderToString(
    React.createElement(LocationSelect, {
      value: { regionCode: null, provinceCode: null, cityCode: null },
      onChange: () => {},
    }),
  );
  expect(countRegionOptions(html)).toBeGreaterThan(15);
});
