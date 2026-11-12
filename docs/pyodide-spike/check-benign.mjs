// Fixed functional checks only. This driver never imports the adversarial suite.
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {createHash, randomUUID} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';
import {chromium} from '@playwright/test';

export const previewOrigin = 'https://h2compute-pyodide-preview-6xu10swwo-poopoopeepee.vercel.app';
const deployment = 'dpl_EtLXtsqjPxkTVUAeaGhwJ6tZQ3BA';
const projectId = 'prj_PkuO8behJUpWctZUJiUCmADIVQ5m';
const team = 'team_Z39ZqQNlBpVBnGnt7ktsEjSc';
const digest = '1825befc25da4421c26bb27cfb625a3f9714220cac2652cbd6bd40a17cd6d3f2';
const packageURL = new URL('./.preview/314.0.7-1825befc25da/', import.meta.url);
const corePrefix = '/runtime/314.0.7/';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

export function selectTarget(mode) {
  assert.ok(mode === '--hosted' || mode === '--local', 'Choose --local or the pinned --hosted target');
  return mode === '--hosted' ? previewOrigin : 'http://127.0.0.1:3191';
}

export function sessionCookie(header) {
  const [pair, ...attributes] = header.split(';').map(value => value.trim());
  const separator = pair.indexOf('=');
  assert.ok(separator > 0, 'Invalid session cookie');
  const attrs = Object.fromEntries(attributes.map(part => {
    const index = part.indexOf('=');
    return index < 0 ? [part.toLowerCase(), true] : [part.slice(0, index).toLowerCase(), part.slice(index + 1)];
  }));
  const host = new URL(previewOrigin).hostname;
  assert.ok(!attrs.domain || attrs.domain === host, 'Cookie must be limited to the exact preview host');
  assert.equal(attrs.secure, true, 'Session cookie must be Secure');
  assert.equal(attrs.httponly, true, 'Session cookie must be HttpOnly');
  assert.equal(attrs.path ?? '/', '/', 'Unexpected session cookie path');
  const sameSite = String(attrs.samesite ?? 'Lax');
  assert.ok(['Lax', 'Strict', 'None'].includes(sameSite), 'Unexpected SameSite attribute');
  return {name: pair.slice(0, separator), value: pair.slice(separator + 1), domain: host, path: '/', secure: true, httpOnly: true, sameSite};
}

export function assertCompleted(result, stdout, stderr) {
  assert.equal(result.state, 'completed');
  assert.equal(result.stdout, stdout);
  assert.equal(result.stderr, stderr);
  assert.equal(result.version, '314.0.7');
  assert.match(result.python, /^3\.14\.2 /);
  assert.ok(result.loadMs > 0 && result.loadMs < 30000, 'Original loading limit');
  assert.ok(result.totalMs - result.loadMs < 5250, 'Original execution limit plus cleanup fallback');
}

async function authorizePreview() {
  const entry = process.env.VERCEL_CLI_ENTRY;
  assert.ok(entry, 'Set VERCEL_CLI_ENTRY to the existing installed CLI entry point');
  const run = promisify(execFile);
  const cli = async args => {
    try {
      const {stdout} = await run(process.execPath, [entry, ...args, '--scope', team], {maxBuffer: 1024 * 1024, timeout: 30000});
      return JSON.parse(stdout);
    } catch { throw new Error('Authenticated CLI read failed (credential-bearing output suppressed)'); }
  };
  const inspected = await cli(['inspect', previewOrigin, '--format', 'json']);
  assert.equal(inspected.id ?? inspected.uid, deployment, 'Exact deployment required');
  assert.equal(inspected.target, 'preview');
  assert.equal(inspected.readyState ?? inspected.state, 'READY');
  const project = await cli(['api', '/v9/projects/' + projectId, '--method', 'GET']);
  assert.equal(project.id, projectId);
  assert.equal(project.ssoProtection?.deploymentType, 'all_except_custom_domains');
  const existing = Object.keys(project.protectionBypass ?? {});
  assert.equal(existing.length, 1, 'Require exactly one existing automation credential; never create one');
  // Scope this credential to one explicit request, with redirects disabled.
  const response = await fetch(previewOrigin + '/', {
    headers: {'x-vercel-protection-bypass': existing[0], 'x-vercel-set-bypass-cookie': 'samesitenone'},
    redirect: 'manual', signal: AbortSignal.timeout(20000),
  });
  assert.ok([200, 307].includes(response.status), 'Session bootstrap failed; protection must remain unchanged');
  if (response.status === 307) assert.equal(new URL(response.headers.get('location'), previewOrigin).origin, previewOrigin);
  const cookies = response.headers.getSetCookie().map(sessionCookie);
  assert.ok(cookies.length > 0, 'No HttpOnly session established');
  await response.body?.cancel();
  return cookies;
}

export async function checkBenign(mode) {
  const target = selectTarget(mode);
  const manifest = JSON.parse(await readFile(new URL('package-manifest.json', packageURL), 'utf8'));
  assert.equal(manifest.learnerExecutionEnabled, false);
  const runtime = Object.keys(manifest.files).filter(path => path.startsWith('runtime/'));
  assert.equal(runtime.length, 5);
  const output = new URL(`./.runtime/benign-${new Date().toISOString().replaceAll(':', '-')}-${randomUUID()}.json`, import.meta.url);
  await mkdir(new URL('./.runtime/', import.meta.url), {recursive: true});
  const evidence = {date: new Date().toISOString(), target, mode, deployment: mode === '--hosted' ? deployment : null,
    contentSHA256: digest, environment: `${os.platform()} ${os.release()} ${os.arch()}; desktop Chromium; no physical-device evidence`,
    auth: mode === '--hosted' ? 'Existing credential exchanged for exact-host HttpOnly cookie; no browser auth header or request routing' : 'Loopback; no authentication',
    limits: {loadingMs: 30000, executionMs: 5000, jobs: 3, maximumRuntimeRequests: 10}, runs: [], outcome: 'failed'};
  let browser;
  let stage = 'local package verification';
  try {
    // Verify the complete immutable local package, without rebuilding it.
    for (const [path, record] of Object.entries(manifest.files)) {
      const bytes = await readFile(new URL('public/' + path, packageURL));
      assert.equal(bytes.length, record.bytes, path);
      assert.equal(sha256(bytes), record.sha256, path);
    }
    stage = 'authentication';
    const cookies = mode === '--hosted' ? await authorizePreview() : [];
    stage = 'browser launch';
    browser = await chromium.launch();
    evidence.browser = browser.version();
    const context = await browser.newContext();
    await context.addCookies(cookies);
    const page = await context.newPage();
    page.setDefaultTimeout(35000);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    // No route/interception, cache-disable command, tracing, HAR or storage export.
    let activeRun, runtimeRequests = 0, totalRequests = 0;
    const pending = [];
    let networkIssue;
    const failNetwork = reason => { networkIssue ??= reason; void context.close(); };
    page.on('request', request => {
      const url = new URL(request.url());
      if (!['http:', 'https:'].includes(url.protocol)) return;
      const path = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      const permitted = url.origin === target && !url.search && (manifest.files[path] || path === 'favicon.ico');
      if (!permitted || request.method() !== 'GET' || ++totalRequests > 24) return failNetwork('Unexpected request scope');
      if (url.pathname.startsWith(corePrefix) && ++runtimeRequests > 10) return failNetwork('Runtime download budget exceeded');
    });
    page.on('response', response => {
      const url = new URL(response.url());
      const path = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      if (url.origin !== target || !manifest.files[path]) return;
      const owner = activeRun;
      pending.push((async () => {
        assert.equal(response.status(), 200, path + ': delivery/authentication');
        const bytes = await response.body();
        assert.equal(sha256(bytes), manifest.files[path].sha256, path + ': served bytes');
        const headers = await response.allHeaders();
        assert.equal(headers['content-security-policy'], manifest.files[path].headers['Content-Security-Policy']);
        assert.ok(!headers['access-control-allow-origin'], path + ': no CORS permission');
        if (owner && path.startsWith('runtime/')) owner.responses.push({path, status: response.status(), sha256: sha256(bytes), decodedBytes: bytes.length,
          cacheControl: headers['cache-control'], encoding: headers['content-encoding'] ?? null, cdnCache: headers['x-vercel-cache'] ?? null});
      })().catch(() => { failNetwork('Delivery/hash/header check failed: ' + path); }));
    });
    const requestPaths = new Map();
    const cacheHits = new Set();
    cdp.on('Network.requestWillBeSent', event => {
      const url = new URL(event.request.url);
      if (url.origin === target && url.pathname.startsWith(corePrefix)) requestPaths.set(event.requestId, {path: url.pathname.slice(1), owner: activeRun});
    });
    cdp.on('Network.requestServedFromCache', event => cacheHits.add(event.requestId));
    cdp.on('Network.responseReceived', event => {
      const request = requestPaths.get(event.requestId);
      if (request?.owner) request.owner.browserResponses.push({path: request.path, status: event.response.status,
        fromDiskCache: Boolean(event.response.fromDiskCache), fromServiceWorker: Boolean(event.response.fromServiceWorker), requestServedFromCache: cacheHits.has(event.requestId)});
    });
    cdp.on('Network.loadingFinished', event => {
      const request = requestPaths.get(event.requestId);
      if (request?.owner) request.owner.networkFinished.push({path: request.path, encodedDataLength: event.encodedDataLength});
    });
    const first = {source: 'import sys\nprint(input())\nprint("error channel",file=sys.stderr)', stdin: 'supplied input\n', stdout: 'supplied input\n', stderr: 'error channel\n'};
    const unicode = {source: 'import sys\nprint(input())\nsys.stdout.write("끝")', stdin: 'é\n', stdout: 'é\n끝', stderr: ''};
    stage = 'initial navigation';
    await page.goto(target, {waitUntil: 'load'});
    for (const [name, example] of [['cold', first], ['same-page-warm', unicode], ['reload', first]]) {
      stage = name;
      activeRun = {name, responses: [], browserResponses: [], networkFinished: []};
      evidence.runs.push(activeRun);
      if (name === 'reload') await page.reload({waitUntil: 'load'});
      await page.waitForFunction(() => typeof window.spike?.execute === 'function');
      await page.evaluate(() => performance.clearResourceTimings());
      const result = await page.evaluate(({source, stdin}) => window.spike.execute(source, stdin), example);
      Object.assign(activeRun, result);
      activeRun.resources = await page.evaluate(() => performance.getEntriesByType('resource').filter(entry => new URL(entry.name).pathname.startsWith('/runtime/314.0.7/')).map(entry => ({path: new URL(entry.name).pathname.slice(1), transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize, decodedBodySize: entry.decodedBodySize})));
      await Promise.all(pending);
      assert.ok(!networkIssue, networkIssue ?? '');
      assertCompleted(result, example.stdout, example.stderr);
      activeRun.framesRemaining = await page.locator('iframe').count();
      for (let attempt = 0; attempt < 20 && (await cdp.send('Target.getTargets')).targetInfos.some(target => target.type === 'worker'); attempt++) await page.waitForTimeout(100);
      activeRun.workersRemaining = (await cdp.send('Target.getTargets')).targetInfos.filter(target => target.type === 'worker').length;
      activeRun.hostResponsive = await page.evaluate(() => document.getElementById('sentinel')?.textContent === 'Theory/progress sentinel');
      assert.equal(activeRun.framesRemaining, 0);
      assert.equal(activeRun.workersRemaining, 0);
      assert.equal(activeRun.hostResponsive, true);
      assert.equal(activeRun.resources.length, name === 'same-page-warm' ? 0 : 5);
      assert.equal(activeRun.responses.length, name === 'same-page-warm' ? 0 : 5);
      console.log(`${name}: completed; load ${Math.round(result.loadMs)} ms; ${activeRun.resources.length} core requests`);
      activeRun = undefined;
    }
    evidence.runtimeRequests = runtimeRequests;
    evidence.totalRequests = totalRequests;
    evidence.outcome = 'passed';
  } catch {
    // Do not serialize error objects, assertions or CLI responses that might contain credentials.
    evidence.failureStage = stage;
    console.error('Benign verification failed at ' + stage + '; see sanitized evidence.');
    process.exitCode = 1;
  } finally {
    await browser?.close();
    await writeFile(output, JSON.stringify(evidence, null, 2) + '\n', {flag: 'wx'});
    console.log('Sanitized evidence: ' + fileURLToPath(output));
  }
  return evidence;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await checkBenign(process.argv[2]);
