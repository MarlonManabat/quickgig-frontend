import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatNotification } from '../../lib/notificationFormat';

test('message:new mapping', () => {
  const msg = formatNotification({
    type: 'message:new',
    payload: { counterparty: 'Ana' },
  });
  assert.equal(msg, 'Ana sent a new message');
});

test('application:status mapping', () => {
  const msg = formatNotification({
    type: 'application:status',
    payload: { job_title: 'Test', status: 'hired' },
  });
  assert.equal(msg, 'Your application to Test was hired');
});

