import assert from 'node:assert/strict';
import test from 'node:test';
import {summarizeSamples} from './check-resources.mjs';

test('partial counter snapshots cannot understate the reported complete-observation peak', () => {
  const result = summarizeSamples([
    {availablePhysicalBytes: 900, processes: [{workingSetBytes: 100, privateUsage: 200}]},
    {availablePhysicalBytes: 800, processes: [{queryError: 87}]},
    {availablePhysicalBytes: 850, processes: [{workingSetBytes: 120, privateUsage: 250}]},
  ]);
  assert.deepEqual(result, {samples: 3, partialSamples: 1, minAvailablePhysicalBytes: 800,
    maxSampledAggregateWorkingSetBytes: 120, maxSampledAggregatePrivateBytes: 250});
  assert.throws(() => summarizeSamples([{processes: [{queryError: 87}]}]));
});
