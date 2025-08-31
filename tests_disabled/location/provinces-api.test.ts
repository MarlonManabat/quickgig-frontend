import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../../pages/api/locations/provinces';

function mockRes() {
  const res: any = {};
  res.statusCode = 200;
  res.headers = {};
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.setHeader = (k: string, v: string) => {
    res.headers[k] = v;
  };
  res.jsonData = null;
  res.json = (data: any) => {
    res.jsonData = data;
    return res;
  };
  return res;
}

test('NCR province returns Metro Manila', async () => {
  const req: any = { query: { region_id: '130000000' } };
  const res = mockRes();
  await handler(req, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.jsonData, [{ id: 'NCR', name: 'Metro Manila' }]);
});
