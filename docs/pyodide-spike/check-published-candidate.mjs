// Only ordinary GET delivery and three fixed I/O jobs; never security probes.
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {createHash, randomUUID} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';
import {assertCompleted} from './check-benign.mjs';
import {selectEngine, withDeadline} from './check-desktop.mjs';

export const candidateOrigin = 'https://h2compute-pyodide-preview-poqbeuq87-poopoopeepee.vercel.app';
const deployment = 'dpl_8FWsm9aGym5xyTEqfx846eeWDbmV';
const team = 'team_Z39ZqQNlBpVBnGnt7ktsEjSc', projectId = 'prj_PkuO8behJUpWctZUJiUCmADIVQ5m';
const digest = 'a2f184eead72face3053c3f6331bbd268081864fe718f83351072acd1eb9c0a7';
const root = new URL('./.preview/314.0.7-a2f184eead72/', import.meta.url);
const sha = b => createHash('sha256').update(b).digest('hex');

export function candidateCookie(header) {
  const [pair, ...parts] = header.split(';').map(s => s.trim());
  const separator = pair.indexOf('='); assert.ok(separator > 0);
  const attributes = Object.fromEntries(parts.map(part => {
    const i = part.indexOf('='); return i < 0 ? [part.toLowerCase(), true] : [part.slice(0, i).toLowerCase(), part.slice(i + 1)];
  }));
  const hostname = new URL(candidateOrigin).hostname;
  assert.ok(!attributes.domain || attributes.domain === hostname);
  assert.equal(attributes.secure, true); assert.equal(attributes.httponly, true);
  assert.equal(attributes.path ?? '/', '/');
  const sameSite = attributes.samesite ?? 'Lax'; assert.ok(['Lax', 'Strict', 'None'].includes(sameSite));
  return {name: pair.slice(0, separator), value: pair.slice(separator + 1), domain: hostname, path: '/', secure: true, httpOnly: true, sameSite};
}

async function authorize() {
  assert.ok(process.env.VERCEL_CLI_ENTRY, 'Existing installed CLI entry required');
  const run = promisify(execFile);
  const cli = async args => {
    try { return JSON.parse((await run(process.execPath, [process.env.VERCEL_CLI_ENTRY, ...args, '--scope', team], {timeout: 30000, maxBuffer: 2 * 1024 * 1024})).stdout); }
    catch { throw new Error('Authenticated read failed; raw output suppressed'); }
  };
  const d = await cli(['inspect', candidateOrigin, '--format', 'json']);
  assert.equal(d.id ?? d.uid, deployment); assert.equal(d.target, 'preview'); assert.equal(d.readyState ?? d.state, 'READY');
  const project = await cli(['api', '/v9/projects/' + projectId, '--method', 'GET']);
  assert.equal(project.id, projectId); assert.equal(project.ssoProtection?.deploymentType, 'all_except_custom_domains');
  assert.equal(project.enablePreviewFeedback, false); assert.equal(project.enableProductionFeedback, false);
  const existing = Object.keys(project.protectionBypass ?? {}); assert.equal(existing.length, 1);
  const response = await fetch(candidateOrigin + '/', {headers: {'x-vercel-protection-bypass': existing[0], 'x-vercel-set-bypass-cookie': 'samesitenone'}, redirect: 'manual', signal: AbortSignal.timeout(20000)});
  assert.ok([200, 307].includes(response.status));
  if (response.status === 307) assert.equal(new URL(response.headers.get('location'), candidateOrigin).origin, candidateOrigin);
  const cookies = response.headers.getSetCookie().map(candidateCookie); assert.ok(cookies.length > 0);
  await response.body?.cancel(); return cookies;
}

export async function checkPublished(engineName) {
  const engine = selectEngine(engineName);
  const output = new URL(`./.runtime/published-${engineName}-${new Date().toISOString().replaceAll(':', '-')}-${randomUUID()}.json`, import.meta.url);
  await mkdir(new URL('./.runtime/', import.meta.url), {recursive: true});
  const evidence = {date: new Date().toISOString(), target: candidateOrigin, deployment, engine: engineName, contentSHA256: digest,
    environment: `${os.platform()} ${os.release()} ${os.arch()}; protected preview, no physical-device/security evidence`,
    auth: 'Existing project credential exchanged for exact-host Secure HttpOnly cookie; no global browser auth headers, routing, traces or storage export',
    driverSHA256: sha(await readFile(fileURLToPath(import.meta.url))), limits: {loadingMs: 30000, executionMs: 5000, jobs: 3, maximumBrowserRequests: 24, maximumRuntimeRequests: 10},
    delivery: [], runs: [], outcome: 'failed'};
  let browser, stage = 'local immutable package';
  try {
    const manifest = JSON.parse(await readFile(new URL('package-manifest.json', root), 'utf8'));
    assert.equal(manifest.learnerExecutionEnabled, false);
    for (const [path, record] of Object.entries(manifest.files)) {
      const bytes = await readFile(new URL('public/' + path, root)); assert.equal(sha(bytes), record.sha256); assert.equal(bytes.length, record.bytes);
    }
    stage = 'authentication'; const cookies = await authorize();
    stage = 'launch'; browser = await engine.launch(); evidence.browser = browser.version();
    const context = await browser.newContext(); await context.addCookies(cookies);
    // Complete ordinary delivery once, independent of the browser cache.
    if (engineName === 'chromium') {
      stage = '57 ordinary delivery GETs';
      for (const [path, record] of Object.entries(manifest.files)) {
        const url = new URL(path === 'index.html' ? '/' : '/' + path, candidateOrigin);
        assert.equal(url.origin, candidateOrigin);
        const response = await context.request.get(url.href, {maxRedirects: 0, timeout: 20000});
        assert.equal(response.status(), 200); const bytes = await response.body(); const headers = response.headers();
        assert.equal(bytes.length, record.bytes); assert.equal(sha(bytes), record.sha256);
        assert.equal(headers['content-security-policy'], record.headers['Content-Security-Policy']);
        assert.ok(!headers['access-control-allow-origin']);
        assert.equal(headers['content-type'].split(';')[0].trim(), record.headers['Content-Type'].split(';')[0].trim());
        const normalize = text => text.toLowerCase().split(/\s*,\s*/).sort().join(',');
        assert.equal(normalize(headers['cache-control']), normalize(record.headers['Cache-Control']));
        evidence.delivery.push({path, status: 200, sha256: sha(bytes), decodedBytes: bytes.length, encoding: headers['content-encoding'] ?? null});
        await response.dispose();
      }
      assert.equal(evidence.delivery.length, 57);
    }
    const page = await context.newPage(); const liveWorkers = new Set(); let created = 0, totalRequests = 0, runtimeRequests = 0, issue;
    const pending = [];
    page.on('worker', worker => { created++; liveWorkers.add(worker); worker.on('close', () => liveWorkers.delete(worker)); });
    page.on('request', request => {
      const url = new URL(request.url()); if (!['http:', 'https:'].includes(url.protocol)) return;
      const path = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      if (url.origin !== candidateOrigin || url.search || request.method() !== 'GET' || (!manifest.files[path] && path !== 'favicon.ico') || ++totalRequests > 24 || (path.startsWith('runtime/') && ++runtimeRequests > 10)) {
        issue = true; void context.close();
      }
    });
    page.on('response', response => {
      const url = new URL(response.url()); const path = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      if (url.origin !== candidateOrigin || !manifest.files[path]) return;
      pending.push((async () => {
        assert.equal(response.status(), 200); const bytes = await response.body(); const headers = await response.allHeaders();
        assert.equal(sha(bytes), manifest.files[path].sha256);
        assert.equal(headers['content-security-policy'], manifest.files[path].headers['Content-Security-Policy']);
        assert.ok(!headers['access-control-allow-origin']);
      })().catch(() => { issue = true; }));
    });
    await page.goto(candidateOrigin, {waitUntil: 'load'});
    const first = {source: 'import sys\nprint(input())\nprint("error channel",file=sys.stderr)', stdin: 'supplied input\n', stdout: 'supplied input\n', stderr: 'error channel\n'};
    const unicode = {source: 'import sys\nprint(input())\nsys.stdout.write("끝")', stdin: 'é\n', stdout: 'é\n끝', stderr: ''};
    for (const [name, example] of [['cold', first], ['same-page-warm', unicode], ['reload', first]]) {
      stage = name; if (name === 'reload') await page.reload({waitUntil: 'load'});
      await page.waitForFunction(() => typeof window.spike?.execute === 'function');
      const before = created;
      await page.evaluate(() => performance.clearResourceTimings());
      const result = await withDeadline(() => page.evaluate(({source, stdin}) => window.spike.execute(source, stdin), example));
      const record = {name, ...result}; evidence.runs.push(record); assertCompleted(result, example.stdout, example.stderr);
      await Promise.all(pending); assert.ok(!issue);
      record.resources = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => new URL(r.name).pathname.startsWith('/runtime/314.0.7/')).map(r => ({path: new URL(r.name).pathname.slice(1), transferSize: r.transferSize, encodedBodySize: r.encodedBodySize, decodedBodySize: r.decodedBodySize})));
      for (let i = 0; i < 20 && liveWorkers.size; i++) await page.waitForTimeout(100);
      record.workersCreated = created - before; record.workersRemaining = liveWorkers.size; record.framesRemaining = await page.locator('iframe').count();
      assert.equal(record.workersCreated, 1); assert.equal(record.workersRemaining, 0); assert.equal(record.framesRemaining, 0);
      assert.equal(await page.locator('#sentinel').textContent(), 'Theory/progress sentinel');
      assert.equal(record.resources.length, name === 'same-page-warm' ? 0 : 5);
      console.log(`${engineName} hosted ${name}: completed; load ${Math.round(result.loadMs)} ms; worker closed`);
    }
    evidence.totalBrowserRequests = totalRequests; evidence.runtimeRequests = runtimeRequests; evidence.outcome = 'passed';
  } catch {
    evidence.failureStage = stage; process.exitCode = 1; console.error(`${engineName} fixed hosted check failed at ${stage}; raw errors suppressed.`);
  } finally {
    await browser?.close(); await writeFile(output, JSON.stringify(evidence, null, 2) + '\n', {flag: 'wx'});
    console.log('Sanitized evidence: ' + fileURLToPath(output));
  }
  return evidence;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await checkPublished(process.argv[2]);
