// Local-only runtime behavior regression. No hosted URL or caller source input.
import assert from 'node:assert/strict';
import {createHash, randomUUID} from 'node:crypto';
import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {selectEngine, withDeadline} from './check-desktop.mjs';

const origin = 'http://127.0.0.1:3190';
export async function checkRecovery(engineName) {
  const engine = selectEngine(engineName);
  const output = new URL(`./.runtime/recovery-${engineName}-${new Date().toISOString().replaceAll(':', '-')}-${randomUUID()}.json`, import.meta.url);
  await mkdir(new URL('./.runtime/', import.meta.url), {recursive: true});
  const hashes = {};
  for (const name of ['host.mjs', 'frame.html', 'worker.mjs']) hashes[name] = createHash('sha256').update(await readFile(new URL('./' + name, import.meta.url))).digest('hex');
  const evidence = {date: new Date().toISOString(), engine: engineName, origin,
    environment: `${os.platform()} ${os.release()} ${os.arch()}; source loopback; no deployment or physical device`,
    sourceSHA256: hashes, limits: {loadingMs: 30000, executionMs: 5000, driverDeadlineMs: 36000}, runs: [], authoredComparisons: 0, outcome: 'failed'};
  let browser, stage = 'launch';
  try {
    browser = await engine.launch();
    evidence.browser = browser.version();
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(35000);
    const workers = new Set();
    let created = 0;
    page.on('worker', worker => {created++; workers.add(worker); worker.on('close', () => workers.delete(worker));});
    let requestFailure;
    page.on('request', request => {
      const url = new URL(request.url());
      if (['http:', 'https:'].includes(url.protocol) && (url.origin !== origin || request.method() !== 'GET' || url.search)) {
        requestFailure = true; void context.close();
      }
    });
    stage = 'navigation';
    await page.goto(origin, {waitUntil: 'load'});
    await page.waitForFunction(() => typeof window.spike?.execute === 'function');
    const cleanup = async (record, countBefore) => {
      for (let attempt = 0; attempt < 20 && workers.size; attempt++) await page.waitForTimeout(100);
      record.workersCreated = created - countBefore;
      record.workersRemaining = workers.size;
      record.framesRemaining = await page.locator('iframe').count();
      record.hostSentinel = await page.locator('#sentinel').textContent();
      assert.equal(record.workersCreated, 1);
      assert.equal(record.workersRemaining, 0);
      assert.equal(record.framesRemaining, 0);
      assert.equal(record.hostSentinel, 'Theory/progress sentinel');
      assert.ok(!requestFailure, 'Unexpected HTTP request scope');
    };
    const run = async (name, source, stdin, state, stdout, detail) => {
      stage = name;
      const record = {name}; evidence.runs.push(record);
      const countBefore = created;
      await withDeadline(async () => {
        const result = await page.evaluate(({source, stdin}) => window.spike.execute(source, stdin), {source, stdin});
        Object.assign(record, result);
        assert.equal(record.state, state);
        if (stdout !== undefined) assert.equal(record.stdout, stdout);
        if (detail) assert.ok(record.detail.includes(detail));
        assert.equal(record.version, '314.0.7');
        assert.match(record.python, /^3\.14\.2 /);
        assert.ok(record.loadMs > 0 && record.loadMs < 30000);
        assert.ok(record.totalMs - record.loadMs < 5250);
        assert.ok(Buffer.byteLength(record.stdout + record.stderr) <= 16384);
        await cleanup(record, countBefore);
      });
      console.log(`${engineName} ${name}: ${record.state}; worker closed`);
    };
    await run('ready', 'print("ready")', '', 'completed', 'ready\n');
    await run('syntax feedback', 'if :', '', 'runtime-error', '', 'SyntaxError');
    await run('runtime feedback', '1/0', '', 'runtime-error', '', 'ZeroDivisionError');
    await run('input EOF', 'input()', '', 'runtime-error', '', 'EOFError');
    await run('real loop watchdog', 'while True: pass', '', 'timeout', '');
    for (const action of ['cancel', 'reset']) {
      stage = action;
      const record = {name: action + ' real loop'}; evidence.runs.push(record);
      const countBefore = created;
      await withDeadline(async () => {
        await page.evaluate(() => { window.pending = window.spike.execute('while True: pass', ''); });
        await page.waitForFunction(() => window.spike.state === 'running');
        record.hostResponsiveDuringLoop = await page.evaluate(action => {
          const running = window.spike.state === 'running';
          window.spike[action]();
          return running;
        }, action);
        Object.assign(record, await page.evaluate(() => window.pending));
        assert.equal(record.hostResponsiveDuringLoop, true);
        assert.equal(record.state, 'cancelled');
        await cleanup(record, countBefore);
      });
      console.log(`${engineName} ${action}: cancelled; worker closed`);
      await run(action + ' recovery', 'print("fresh")', '', 'completed', 'fresh\n');
    }
    await run('bounded output flood', 'while True: print("x"*1000)', '', 'output-limit');
    await run('prior globals and file', 'prior=42\nopen("/tmp/prior","w").write("prior")', '', 'completed', '');
    await run('fresh case state', 'import os\nprint("prior" in globals(),os.path.exists("/tmp/prior"))', '', 'completed', 'False False\n');
    for (const name of (await readdir(new URL('../../content/exercises/', import.meta.url))).sort()) {
      const text = await readFile(new URL('../../content/exercises/' + name, import.meta.url), 'utf8');
      const metadata = JSON.parse(text.split('---')[1]);
      for (const [model, source] of [...text.split('<!-- model -->')[1].matchAll(/```python\r?\n([\s\S]*?)```/g)].entries()) {
        for (const [index, example] of metadata.examples.entries()) {
          await run(`authored ${name} model ${model} case ${index}`, source[1], example.input, 'completed', example.output);
          evidence.authoredComparisons++;
        }
      }
    }
    assert.equal(evidence.authoredComparisons, 20);
    evidence.outcome = 'passed';
  } catch (error) {
    evidence.failureStage = stage;
    evidence.failureReason = String(error.message).slice(0, 1000);
    console.error(`${engineName} recovery failed at ${stage}`);
    process.exitCode = 1;
  } finally {
    await browser?.close();
    await writeFile(output, JSON.stringify(evidence, null, 2) + '\n', {flag: 'wx'});
    console.log('Evidence: ' + fileURLToPath(output));
  }
  return evidence;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await checkRecovery(process.argv[2]);
