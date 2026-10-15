// Local desktop-engine functional checks only; never accepts a hosted target.
import assert from 'node:assert/strict';
import {createHash, randomUUID} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {chromium, firefox, webkit} from '@playwright/test';
import {assertCompleted} from './check-benign.mjs';

const engines = {chromium, firefox, webkit};
const packageRoot = new URL('./.preview/314.0.7-1825befc25da/', import.meta.url);
const digest = '1825befc25da4421c26bb27cfb625a3f9714220cac2652cbd6bd40a17cd6d3f2';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

export function selectEngine(name) {
  assert.ok(Object.hasOwn(engines, name), 'Choose chromium, firefox or webkit; hosted targets are not accepted');
  return engines[name];
}

export function selectVariant(variant) {
  assert.ok(['--package', '--source', '--candidate'].includes(variant), 'Choose --package, --source or --candidate; no arbitrary server');
  return variant === '--source' ? {origin: 'http://127.0.0.1:3190', prefix: '/runtime/'} : {origin: 'http://127.0.0.1:3191', prefix: '/runtime/314.0.7/'};
}

export async function withDeadline(action, milliseconds = 36000) {
  let timer;
  try {
    return await Promise.race([action(), new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('External test-driver deadline exceeded')), milliseconds);
    })]);
  } finally { clearTimeout(timer); }
}

function diagnostic(value) {
  return String(value).replace(/data:[^\s"'<>]*/g, '<data-module>').slice(0, 1000);
}

export async function checkDesktop(name, variant = '--package') {
  const engine = selectEngine(name);
  const {origin, prefix} = selectVariant(variant);
  const selectedPackage = variant === '--candidate' ? new URL('./.preview/314.0.7-a2f184eead72/', import.meta.url) : packageRoot;
  const selectedDigest = variant === '--candidate' ? 'a2f184eead72face3053c3f6331bbd268081864fe718f83351072acd1eb9c0a7' : digest;
  const manifest = JSON.parse(await readFile(new URL('package-manifest.json', selectedPackage), 'utf8'));
  assert.equal(manifest.learnerExecutionEnabled, false);
  const expected = {...manifest.files};
  const sourceSHA256 = {};
  if (variant === '--source') {
    for (const path of ['index.html', 'host.mjs', 'frame.html', 'worker.mjs']) {
      const bytes = await readFile(new URL('./' + path, import.meta.url));
      sourceSHA256[path] = sha256(bytes);
      expected[path] = {...manifest.files[path], bytes: bytes.length, sha256: sourceSHA256[path]};
    }
    for (const [path, record] of Object.entries(manifest.files)) if (path.startsWith('runtime/')) expected['runtime/' + path.split('/').pop()] = record;
  }
  const output = new URL(`./.runtime/desktop-${name}-${new Date().toISOString().replaceAll(':', '-')}-${randomUUID()}.json`, import.meta.url);
  await mkdir(new URL('./.runtime/', import.meta.url), {recursive: true});
  const evidence = {date: new Date().toISOString(), engine: name, variant, origin, contentSHA256: variant === '--source' ? null : selectedDigest,
    baselinePackageContentSHA256: digest, sourceSHA256,
    environment: `${os.platform()} ${os.release()} ${os.arch()}; local desktop engine; no deployed or physical-device evidence`,
    driverSHA256: sha256(await readFile(fileURLToPath(import.meta.url))),
    limits: {loadingMs: 30000, executionMs: 5000, driverDeadlineMs: 36000}, runs: [], diagnostics: [], outcome: 'failed'};
  let browser, stage = 'package verification';
  try {
    for (const [path, record] of Object.entries(manifest.files)) {
      const bytes = await readFile(new URL('public/' + path, selectedPackage));
      assert.equal(bytes.length, record.bytes, path);
      assert.equal(sha256(bytes), record.sha256, path);
    }
    stage = 'launch';
    browser = await engine.launch();
    evidence.browser = browser.version();
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(35000);
    let networkFailure;
    const pending = [];
    const liveWorkers = new Set();
    let workersCreated = 0;
    page.on('worker', worker => {
      workersCreated++;
      liveWorkers.add(worker);
      worker.on('close', () => liveWorkers.delete(worker));
    });
    page.on('pageerror', error => {
      if (evidence.diagnostics.length < 20) evidence.diagnostics.push({kind: 'pageerror', message: diagnostic(error.message)});
    });
    page.on('console', message => {
      if (message.type() === 'error' && evidence.diagnostics.length < 20) evidence.diagnostics.push({kind: 'console-error', message: diagnostic(message.text())});
    });
    page.on('request', request => {
      const url = new URL(request.url());
      if (['http:', 'https:'].includes(url.protocol) && (url.origin !== origin || request.method() !== 'GET' || url.search)) {
        networkFailure = 'Unexpected HTTP request scope';
        void context.close();
      }
    });
    page.on('response', response => {
      const url = new URL(response.url());
      if (url.origin !== origin) return;
      const path = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      if (!expected[path]) return;
      pending.push((async () => {
        assert.equal(response.status(), 200, path);
        const bytes = await response.body();
        assert.equal(sha256(bytes), expected[path].sha256, path);
        const headers = await response.allHeaders();
        assert.equal(headers['content-security-policy'], expected[path].headers['Content-Security-Policy']);
        assert.ok(!headers['access-control-allow-origin']);
      })().catch(() => { networkFailure = 'Delivery/hash/header validation failed: ' + path; }));
    });
    stage = 'navigation';
    await page.goto(origin, {waitUntil: 'load'});
    await page.waitForFunction(() => typeof window.spike?.execute === 'function');
    const first = {source: 'import sys\nprint(input())\nprint("error channel",file=sys.stderr)', stdin: 'supplied input\n', stdout: 'supplied input\n', stderr: 'error channel\n'};
    const unicode = {source: 'import sys\nprint(input())\nsys.stdout.write("끝")', stdin: 'é\n', stdout: 'é\n끝', stderr: ''};
    for (const [job, example] of [['cold', first], ['same-page-warm', unicode], ['reload', first]]) {
      stage = job;
      if (job === 'reload') {
        await page.reload({waitUntil: 'load'});
        await page.waitForFunction(() => typeof window.spike?.execute === 'function');
      }
      const run = {name: job};
      evidence.runs.push(run);
      const createdBefore = workersCreated;
      await withDeadline(async () => {
        await page.evaluate(() => performance.clearResourceTimings());
        const result = await page.evaluate(({source, stdin}) => window.spike.execute(source, stdin), example);
        Object.assign(run, result);
        await Promise.all(pending);
        assert.ok(!networkFailure, networkFailure ?? '');
        assertCompleted(result, example.stdout, example.stderr);
        run.resources = await page.evaluate(prefix => performance.getEntriesByType('resource').filter(entry => new URL(entry.name).pathname.startsWith(prefix)).map(entry => ({path: new URL(entry.name).pathname.slice(1), transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize, decodedBodySize: entry.decodedBodySize})), prefix);
        for (let attempt = 0; attempt < 20 && liveWorkers.size; attempt++) await page.waitForTimeout(100);
        run.framesRemaining = await page.locator('iframe').count();
        run.workersCreated = workersCreated - createdBefore;
        run.workersRemaining = liveWorkers.size;
        run.hostSentinel = await page.locator('#sentinel').textContent();
        assert.equal(run.framesRemaining, 0);
        assert.equal(run.workersCreated, 1, 'Observe a real dedicated worker, not an empty cleanup count');
        assert.equal(run.workersRemaining, 0);
        assert.equal(run.hostSentinel, 'Theory/progress sentinel');
        assert.equal(run.resources.length, job === 'same-page-warm' ? 0 : 5);
      });
      console.log(`${name} ${job}: completed; load ${Math.round(run.loadMs)} ms; one observed worker closed`);
    }
    evidence.outcome = 'passed';
  } catch (error) {
    evidence.failureStage = stage;
    evidence.failureReason = diagnostic(error.message);
    console.error(`${name}: failed at ${stage}; ${evidence.failureReason.split('\n')[0]}`);
    process.exitCode = 1;
  } finally {
    await browser?.close();
    await writeFile(output, JSON.stringify(evidence, null, 2) + '\n', {flag: 'wx'});
    console.log('Evidence: ' + fileURLToPath(output));
  }
  return evidence;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await checkDesktop(process.argv[2], process.argv[3]);
