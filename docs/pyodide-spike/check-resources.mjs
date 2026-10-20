// Fixed Windows/Chromium loopback observations; never an exhaustion or hosted test.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createHash, randomUUID} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import os from 'node:os';
import {createInterface} from 'node:readline';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';
import {withDeadline} from './check-desktop.mjs';

const origin = 'http://127.0.0.1:3190';
const MiB = 1024 * 1024;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export function summarizeSamples(samples) {
  const complete = samples.filter(s => s.processes.length > 0 && s.processes.every(p => !p.queryError));
  assert.ok(complete.length, 'Need a complete process-counter observation');
  return {samples: samples.length, partialSamples: samples.length - complete.length,
    minAvailablePhysicalBytes: Math.min(...samples.map(s => s.availablePhysicalBytes)),
    maxSampledAggregateWorkingSetBytes: Math.max(...complete.map(s => s.processes.reduce((n, p) => n + p.workingSetBytes, 0))),
    maxSampledAggregatePrivateBytes: Math.max(...complete.map(s => s.processes.reduce((n, p) => n + p.privateUsage, 0)))};
}

function counterProbe() {
  const child = spawn('python', [fileURLToPath(new URL('./windows-memory.py', import.meta.url))], {stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true});
  const lines = createInterface({input: child.stdout});
  let pending, diagnostic = '', stopped = false;
  child.stderr.on('data', b => { diagnostic = (diagnostic + b.toString()).slice(0, 1000); });
  const fail = error => { stopped = true; pending?.reject(error); pending = undefined; };
  child.stdin.on('error', fail);
  child.on('error', fail);
  child.on('exit', code => fail(new Error(`Memory counter probe exited ${code}: ${diagnostic}`)));
  lines.on('line', line => {
    const current = pending; pending = undefined;
    if (!current) return;
    try { assert.ok(line.length < 65536); current.resolve(JSON.parse(line)); } catch (error) { current.reject(error); }
  });
  return {
    async read(ids) {
      assert.ok(!pending && !stopped, 'Counter probe must be live with one request at a time');
      return await withDeadline(() => new Promise((resolve, reject) => {
        pending = {resolve, reject}; child.stdin.write(JSON.stringify(ids) + '\n');
      }), 5000);
    },
    close() { lines.close(); child.stdin.end(); child.kill(); },
  };
}

export async function checkResources() {
  assert.equal(process.platform, 'win32', 'Windows observation only');
  const output = new URL(`./.runtime/resources-${new Date().toISOString().replaceAll(':', '-')}-${randomUUID()}.json`, import.meta.url);
  await mkdir(new URL('./.runtime/', import.meta.url), {recursive: true});
  const evidence = {date: new Date().toISOString(), environment: `${os.platform()} ${os.release()} ${os.arch()}; local desktop; not physical mobile or low-memory exhaustion`,
    origin, limits: {loadingMs: 30000, executionMs: 5000, allocationBytes: 32 * MiB, initialAvailableFloorBytes: 1536 * MiB,
      abortAvailableFloorBytes: 768 * MiB, abortSampledPrivateBytes: 1024 * MiB, requestedSamplingIntervalMs: 250},
    sourceSHA256: {}, driverSHA256: {}, samples: [], runs: [], outcome: 'failed'};
  for (const name of ['host.mjs', 'frame.html', 'worker.mjs']) evidence.sourceSHA256[name] = sha(await readFile(new URL('./' + name, import.meta.url)));
  for (const name of ['check-resources.mjs', 'windows-memory.py']) evidence.driverSHA256[name] = sha(await readFile(new URL('./' + name, import.meta.url)));
  const probe = counterProbe();
  let browser, phase = 'preflight', sampling = false, sampler, samplingFailure;
  try {
    const system = await probe.read([]);
    evidence.preflight = system;
    assert.ok(system.availablePhysicalBytes >= evidence.limits.initialAvailableFloorBytes, 'Insufficient available memory for bounded observation');
    browser = await chromium.launch();
    evidence.browser = browser.version();
    const browserCDP = await browser.newBrowserCDPSession();
    const sample = async () => {
      const {processInfo} = await browserCDP.send('SystemInfo.getProcessInfo');
      const ids = processInfo.map(p => p.id);
      const counters = await probe.read(ids);
      const row = {elapsedMs: Date.now() - started, phase, ...counters};
      row.processes = row.processes.map(p => ({...p, type: processInfo.find(info => info.id === p.pid)?.type}));
      evidence.samples.push(row);
      assert.ok(evidence.samples.length <= 1000);
      assert.ok(row.availablePhysicalBytes >= evidence.limits.abortAvailableFloorBytes, 'System available-memory guard reached');
      assert.ok(row.processes.reduce((n, p) => n + (p.privateUsage ?? 0), 0) < evidence.limits.abortSampledPrivateBytes, 'Dedicated-browser private-memory guard reached');
    };
    const started = Date.now();
    const context = await browser.newContext();
    const page = await context.newPage();
    const workers = new Set(); let created = 0;
    page.on('worker', worker => { created++; workers.add(worker); worker.on('close', () => workers.delete(worker)); });
    let requestFailure;
    page.on('request', request => {
      const url = new URL(request.url());
      if (['http:', 'https:'].includes(url.protocol) && (url.origin !== origin || request.method() !== 'GET' || url.search)) {
        requestFailure = true; void context.close();
      }
    });
    await page.goto(origin);
    await page.evaluate(() => localStorage.setItem('h2compute.progress', 'resource-sentinel'));
    phase = 'idle'; await sample();
    sampling = true;
    sampler = (async () => {
      while (sampling) {
        await new Promise(resolve => setTimeout(resolve, 250));
        if (sampling) await sample();
      }
    })().catch(async error => {
      samplingFailure = error; sampling = false;
      try { await browser.close(); } catch { /* Preserve the sampling failure and evidence. */ }
    });
    const run = async (name, source, expected, cancel = false) => {
      phase = name; const before = created;
      const result = await withDeadline(async () => {
        if (!cancel) return await page.evaluate(source => window.spike.execute(source), source);
        await page.evaluate(source => { window.pending = window.spike.execute(source); }, source);
        await page.waitForFunction(() => window.spike.state === 'running');
        await page.waitForTimeout(750);
        await page.evaluate(() => window.spike.cancel());
        return await page.evaluate(() => window.pending);
      });
      const record = {name, ...result}; evidence.runs.push(record);
      assert.equal(result.state, cancel ? 'cancelled' : 'completed');
      if (expected !== undefined) assert.equal(result.stdout, expected);
      assert.equal(result.version, '314.0.7'); assert.match(result.python, /^3\.14\.2 /);
      assert.ok(result.loadMs > 0 && result.loadMs < 30000);
      assert.ok(result.totalMs - result.loadMs < 5250);
      for (let i = 0; i < 20 && workers.size; i++) await page.waitForTimeout(100);
      record.workersCreated = created - before; record.workersRemaining = workers.size;
      record.framesRemaining = await page.locator('iframe').count();
      assert.equal(record.workersCreated, 1); assert.equal(record.workersRemaining, 0); assert.equal(record.framesRemaining, 0);
      assert.equal(await page.evaluate(() => localStorage.getItem('h2compute.progress')), 'resource-sentinel');
      assert.equal(await page.locator('#sentinel').textContent(), 'Theory/progress sentinel');
      assert.ok(!requestFailure && !samplingFailure);
      console.log(`${name}: ${result.state}; worker closed`);
    };
    await run('cold baseline', 'print("ready")', 'ready\n');
    await run('warm baseline', 'print("ready")', 'ready\n');
    const allocate = 'import time\npayload=bytearray(32*1024*1024)\nfor i in range(0,len(payload),4096): payload[i]=1\n';
    await run('bounded allocation', allocate + 'deadline=time.monotonic()+0.75\nwhile time.monotonic()<deadline: pass\nprint(len(payload))', '33554432\n');
    await run('fresh state', 'print("payload" in globals())', 'False\n');
    await run('cancel bounded allocation', allocate + 'while True: pass', undefined, true);
    await run('post-cancel recovery', 'print("recovered")', 'recovered\n');
    phase = 'settled'; await page.waitForTimeout(1500);
    sampling = false; await sampler; assert.ok(!samplingFailure);
    assert.ok(evidence.samples.some(s => s.phase === 'bounded allocation' && s.processes.some(p => p.type === 'renderer' && !p.queryError)), 'Must observe live allocation phase');
    evidence.summary = summarizeSamples(evidence.samples);
    evidence.outcome = 'passed';
  } catch (error) {
    evidence.failurePhase = phase; evidence.failureReason = String(samplingFailure?.message ?? error.message).slice(0, 1000);
    process.exitCode = 1; console.error('Resource observation failed: ' + evidence.failureReason);
  } finally {
    sampling = false; await sampler;
    await browser?.close(); probe.close();
    await writeFile(output, JSON.stringify(evidence, null, 2) + '\n', {flag: 'wx'});
    console.log('Evidence: ' + fileURLToPath(output));
  }
  return evidence;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await checkResources();
