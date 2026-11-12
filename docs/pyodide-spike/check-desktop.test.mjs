import assert from 'node:assert/strict';
import test from 'node:test';
import {selectEngine, selectVariant, withDeadline} from './check-desktop.mjs';

test('desktop verification cannot select a hosted URL or inherited object key', () => {
  for (const engine of ['chromium', 'firefox', 'webkit']) assert.equal(selectEngine(engine).name(), engine);
  for (const value of [undefined, 'toString', 'constructor', '--hosted', 'https://example.com']) assert.throws(() => selectEngine(value));
});

test('source diagnostics remain loopback-only and distinct from immutable package evidence', () => {
  assert.deepEqual(selectVariant('--source'), {origin: 'http://127.0.0.1:3190', prefix: '/runtime/'});
  assert.deepEqual(selectVariant('--package'), {origin: 'http://127.0.0.1:3191', prefix: '/runtime/314.0.7/'});
  assert.deepEqual(selectVariant('--candidate'), {origin: 'http://127.0.0.1:3191', prefix: '/runtime/314.0.7/'});
  for (const value of [undefined, '--hosted', 'http://127.0.0.1:9999']) assert.throws(() => selectVariant(value));
});

test('driver deadline bounds an unresponsive evaluation while preserving success/failure', async () => {
  await assert.rejects(withDeadline(() => new Promise(() => {}), 10), /deadline exceeded/);
  assert.equal(await withDeadline(async () => 'completed', 100), 'completed');
  await assert.rejects(withDeadline(async () => { throw new Error('failure'); }, 100), /failure/);
});
