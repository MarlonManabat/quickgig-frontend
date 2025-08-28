import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import LocationSelect from '../../components/location/LocationSelect';

function countCityOptions(html: string) {
  const match = html.match(/data-testid="city-select"[^>]*>([\s\S]*?)<\/select>/);
  if (!match) return 0;
  const options = match[1].match(/<option/g) || [];
  return Math.max(0, options.length - 1); // minus placeholder
}

test('NCR renders 17 city options', () => {
  const html = renderToString(
    React.createElement(LocationSelect, {
      value: { regionCode: '130000000', provinceCode: 'NCR', cityCode: null },
      onChange: () => {},
    }),
  );
  assert.equal(countCityOptions(html), 17);
});

test('Cavite renders more than 10 city options', () => {
  const html = renderToString(
    React.createElement(LocationSelect, {
      value: { regionCode: '040000000', provinceCode: '042100000', cityCode: null },
      onChange: () => {},
    }),
  );
  assert.ok(countCityOptions(html) > 10);
});
