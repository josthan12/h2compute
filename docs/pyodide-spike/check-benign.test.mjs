import assert from 'node:assert/strict';
import test from 'node:test';
import {assertCompleted, previewOrigin, selectTarget, sessionCookie} from './check-benign.mjs';

test('target selection cannot use an alias or an arbitrary host', () => {
  assert.equal(selectTarget('--hosted'), previewOrigin);
  assert.equal(selectTarget('--local'), 'http://127.0.0.1:3191');
  for (const target of [undefined, previewOrigin, 'https://example.com', '--production']) assert.throws(() => selectTarget(target));
});

test('authentication cookie is HttpOnly, Secure and limited to the exact preview', () => {
  const cookie = sessionCookie('session=synthetic; Path=/; HttpOnly; Secure; SameSite=None');
  assert.equal(cookie.domain, new URL(previewOrigin).hostname);
  assert.equal(cookie.httpOnly, true);
  assert.equal(cookie.secure, true);
  for (const attributes of ['Path=/; Secure', 'Path=/; HttpOnly', 'Path=/; HttpOnly; Secure; Domain=.vercel.app', 'Path=/other; HttpOnly; Secure']) {
    assert.throws(() => sessionCookie('session=synthetic; ' + attributes));
  }
});

test('normal completion requires exact output, pinned runtime and unchanged limits', () => {
  const result = {state: 'completed', stdout: 'é\n끝', stderr: '', version: '314.0.7', python: '3.14.2 (test)', loadMs: 1000, totalMs: 1005};
  assertCompleted(result, 'é\n끝', '');
  for (const difference of [{state: 'timeout'}, {stdout: 'wrong'}, {stderr: 'unexpected'}, {version: 'other'}, {python: '3.14.3 '}, {loadMs: 30001}, {totalMs: 7000}]) {
    assert.throws(() => assertCompleted({...result, ...difference}, 'é\n끝', ''));
  }
});
