import assert from 'node:assert/strict';
import test from 'node:test';
import {candidateCookie, candidateOrigin} from './check-published-candidate.mjs';

test('published candidate sessions cannot broaden credential scope or lose cookie protections', () => {
  const cookie = candidateCookie('session=test; Secure; HttpOnly; Path=/; SameSite=None');
  assert.equal(cookie.domain, new URL(candidateOrigin).hostname);
  assert.ok(cookie.secure && cookie.httpOnly);
  for (const header of ['session=test; HttpOnly', 'session=test; Secure',
    'session=test; Secure; HttpOnly; Domain=.vercel.app', 'session=test; Secure; HttpOnly; Path=/other']) {
    assert.throws(() => candidateCookie(header));
  }
});
