// Local-only browser boundary observations. No hosted URL, user source or credentials.
import assert from 'node:assert/strict';
import {createHash, randomUUID} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {selectEngine, withDeadline} from './check-desktop.mjs';

const origin = 'http://127.0.0.1:3190';
const trapOrigin = 'http://127.0.0.1:3192';
const sha = b => createHash('sha256').update(b).digest('hex');
export async function checkIsolation(engineName) {
  const engine = selectEngine(engineName);
  const evidence = {date: new Date().toISOString(), engine: engineName, origin, trapOrigin,
    environment: `${os.platform()} ${os.release()} ${os.arch()}; loopback only, not hosted/device certification`,
    sourceSHA256: {}, driverSHA256: sha(await readFile(fileURLToPath(import.meta.url))), runs: [], trapRequests: 0, trapUpgrades: 0, outcome: 'failed'};
  for (const name of ['host.mjs', 'frame.html', 'worker.mjs']) evidence.sourceSHA256[name] = sha(await readFile(new URL('./' + name, import.meta.url)));
  const output = new URL(`./.runtime/isolation-${engineName}-${new Date().toISOString().replaceAll(':', '-')}-${randomUUID()}.json`, import.meta.url);
  await mkdir(new URL('./.runtime/', import.meta.url), {recursive: true});
  const trap = http.createServer((req, res) => { evidence.trapRequests++; res.writeHead(404); res.end(); });
  trap.on('upgrade', (req, socket) => { evidence.trapUpgrades++; socket.destroy(); });
  let browser, page, stage = 'loopback trap';
  try {
    await new Promise((resolve, reject) => { trap.once('error', reject); trap.listen(3192, '127.0.0.1', resolve); });
    assert.equal((await fetch(trapOrigin + '/control')).status, 404);
    assert.equal(evidence.trapRequests, 1); evidence.trapRequests = 0;
    evidence.trapControlPassed = true;
    stage = 'launch'; browser = await engine.launch(); evidence.browser = browser.version();
    const context = await browser.newContext(); page = await context.newPage();
    const workers = new Set(); let created = 0, fixtureWorker;
    page.on('worker', worker => { created++; workers.add(worker); fixtureWorker = worker; worker.on('close', () => workers.delete(worker)); });
    await page.goto(origin);
    await page.evaluate(() => { localStorage.setItem('h2compute.progress', 'isolation-sentinel'); document.cookie = 'isolation=sentinel; SameSite=Strict'; });
    // Boot-only fixture uses the unchanged real frame, worker and transferred core.
    // Holding at ready permits direct async JS probes without a Python run_sync assumption.
    stage = 'ready fixture';
    const ready = await withDeadline(() => page.evaluate(async () => {
      const names = ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
      const assets = Object.fromEntries(await Promise.all(names.map(async name => [name, await (await fetch('/runtime/' + name)).arrayBuffer()])));
      const workerSource = await (await fetch('/worker.mjs')).text();
      const session = crypto.randomUUID(); const frame = document.createElement('iframe');
      frame.sandbox = 'allow-scripts'; frame.title = 'Local boundary fixture'; frame.hidden = true;
      const channel = new MessageChannel(); window.fixturePort = channel.port1; window.fixtureSession = session;
      const ready = new Promise(resolve => { channel.port1.onmessage = ({data}) => { if (data.session === session) resolve(data); }; });
      frame.onload = () => frame.contentWindow.postMessage({type: 'init', session, assets, workerSource}, '*', [channel.port2]);
      frame.src = '/frame.html'; document.body.append(frame);
      return await ready;
    }));
    assert.equal(ready.type, 'ready'); assert.equal(ready.version, '314.0.7'); assert.match(ready.python, /^3\.14\.2 /);
    assert.equal(workers.size, 1);
    stage = 'worker evaluation availability';
    assert.equal(await fixtureWorker.evaluate(() => 2), 2);
    const boundary = await page.frames()[1].evaluate(host => {
      const result = {};
      for (const [name, action] of Object.entries({DOM: () => parent.document.body, storage: () => localStorage.length,
        cookies: () => document.cookie, navigation: () => { parent.location.href = host + '/forbidden'; }})) {
        try { action(); result[name] = false; } catch { result[name] = true; }
      }
      return result;
    }, origin);
    assert.deepEqual(boundary, {DOM: true, storage: true, cookies: true, navigation: true});
    const network = {}; evidence.fixtureNetwork = network;
    const probe = async (name, action) => {
      stage = name;
      network[name] = await withDeadline(() => fixtureWorker.evaluate(action, trapOrigin), 5000);
    };
    await probe('nativeFetch', async trap => {
      try { await WorkerGlobalScope.prototype.fetch.call(self, trap + '/fetch'); return 'escaped'; } catch (e) { return e.name; }
    });
    await probe('xhr', trap => {
      try { const xhr = new XMLHttpRequest(); xhr.open('GET', trap + '/xhr', false); xhr.send(); return 'escaped'; } catch (e) { return e.name; }
    });
    await probe('websocket', trap => new Promise(resolve => {
      try { const socket = new WebSocket(trap.replace('http:', 'ws:') + '/socket'); socket.onopen = () => { socket.close(); resolve('escaped'); }; socket.onerror = () => resolve('error-event'); }
      catch (e) { resolve(e.name); }
    }));
    stage = 'remoteImport';
    network.exposed = await fixtureWorker.evaluate(() => Object.fromEntries(['window', 'document', 'parent', 'localStorage', 'sessionStorage', 'cookieStore'].map(name => [name, Reflect.has(globalThis, name)])));
    // Use the real Python->JS bridge and a port callback rather than debugger
    // evaluation of import(), which Firefox's automation context rejects.
    network.remoteImport = await withDeadline(() => page.evaluate(async trap => {
      const session = window.fixtureSession;
      const result = new Promise(resolve => {
        window.fixturePort.onmessage = ({data}) => { if (data.session === session && data.type === 'import-probe') resolve(data.detail); };
      });
      const send = value => `postMessage({session:${JSON.stringify(session)},type:"import-probe",detail:${value}})`;
      const program = `import(${JSON.stringify(trap + '/module.mjs')}).then(()=>${send('"escaped"')},error=>${send('error.name')})`;
      const source = 'import js\njs.eval(' + JSON.stringify(program) + ')';
      window.fixturePort.postMessage({session, type: 'run', job: 'import-probe', source, stdin: ''});
      return await result;
    }, trapOrigin), 5000);
    assert.ok(['TypeError', 'SecurityError'].includes(network.nativeFetch));
    assert.ok(['NetworkError', 'SecurityError'].includes(network.xhr));
    assert.ok(['TypeError', 'SecurityError'].includes(network.remoteImport));
    assert.ok(['SecurityError', 'NS_ERROR_CONTENT_BLOCKED', 'error-event'].includes(network.websocket));
    assert.ok(Object.values(network.exposed).every(value => value === false));
    assert.equal(evidence.trapRequests, 0); assert.equal(evidence.trapUpgrades, 0);
    evidence.runs.push({name: 'ready fixture boundaries', boundary, network});
    await withDeadline(() => page.evaluate(async () => {
      await new Promise(resolve => { window.fixturePort.onmessage = ({data}) => { if (data.type === 'disposed') resolve(); }; window.fixturePort.postMessage({session: window.fixtureSession, type: 'dispose'}); });
      window.fixturePort.close(); document.querySelector('iframe').remove();
    }), 5000);
    for (let i = 0; i < 20 && workers.size; i++) await page.waitForTimeout(100);
    assert.equal(workers.size, 0);
    const run = async (name, source, state, stdout, expectedWorkers = 1) => {
      stage = name; const before = created;
      const result = await withDeadline(() => page.evaluate(source => window.spike.execute(source), source));
      assert.equal(result.state, state); if (stdout !== undefined) assert.equal(result.stdout, stdout);
      for (let i = 0; i < 20 && workers.size; i++) await page.waitForTimeout(100);
      const record = {name, ...result, workersCreated: created - before, workersRemaining: workers.size, framesRemaining: await page.locator('iframe').count()};
      evidence.runs.push(record);
      assert.equal(record.workersCreated, expectedWorkers); assert.equal(record.workersRemaining, 0); assert.equal(record.framesRemaining, 0);
      console.log(`${engineName} ${name}: ${state}; worker closed`);
    };
    await run('stale session', 'import js\njs.postMessage(js.JSON.parse(\'{"type":"completed","session":"old","job":"old"}\'))\nprint("real")', 'completed', 'real\n');
    assert.ok(await page.evaluate(() => window.spike.ignored) >= 1);
    await run('wrong job', 'import js\njs.eval(\'globalThis.postMessage=((original)=>m=>{original({...m,job:"old"});original(m)})(postMessage)\')\nprint("real")', 'completed', 'real\n');
    for (const [name, change, state] of [['malformed type', 'type:"unknown"', 'protocol-error'], ['invalid stream', 'stream:"html"', 'protocol-error'],
      ['oversized message', 'type:"output",stream:"stdout",text:"x".repeat(20000)', 'output-limit']]) {
      await run(name, `import js\njs.eval('globalThis.postMessage=((original)=>m=>original({...m,${change}}))(postMessage)')\nprint(1)`, state);
    }
    await run('message flood', 'import js\njs.eval(\'globalThis.postMessage=((original)=>m=>{for(let i=0;i<1000;i++)original(m)})(postMessage)\')\nprint(1)', 'output-limit');
    await run('protocol recovery', 'print("recovered")', 'completed', 'recovered\n');
    await run('source input bound', 'é'.repeat(8193), 'invalid-input', undefined, 0);
    stage = 'stdin input bound';
    assert.equal((await page.evaluate(() => window.spike.execute('print(1)', 'x'.repeat(8193)))).state, 'invalid-input');
    assert.equal(workers.size, 0);
    evidence.runs.push({name: 'stdin input bound', state: 'invalid-input', workersRemaining: 0});
    assert.equal(page.url(), origin + '/');
    assert.equal(await page.evaluate(() => localStorage.getItem('h2compute.progress')), 'isolation-sentinel');
    assert.match(await page.evaluate(() => document.cookie), /isolation=sentinel/);
    assert.equal(await page.locator('#sentinel').textContent(), 'Theory/progress sentinel');
    assert.equal(evidence.trapRequests, 0); assert.equal(evidence.trapUpgrades, 0);
    evidence.outcome = 'passed';
  } catch (error) {
    evidence.failureStage = stage; evidence.failureReason = String(error.message).slice(0, 1000); process.exitCode = 1;
    evidence.pageURL = page?.url();
    console.error(`${engineName} isolation failed at ${stage}: ${evidence.failureReason}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => trap.close(resolve));
    await writeFile(output, JSON.stringify(evidence, null, 2) + '\n', {flag: 'wx'});
    console.log('Evidence: ' + fileURLToPath(output));
  }
  return evidence;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await checkIsolation(process.argv[2]);
