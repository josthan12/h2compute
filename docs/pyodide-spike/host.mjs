const names = ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
const encoder = new TextEncoder();
let active, sequence = 0;
let cachedParts;
window.spike = {
  state: 'idle', stdout: '', stderr: '', detail: '', ignored: 0, frames: 0,
  cancel() { finish('cancelled'); },
  reset() { finish('cancelled'); },
  async execute(source, stdin = '', options = {}) {
    if (typeof source !== 'string' || typeof stdin !== 'string' || encoder.encode(source).length > 16384 || encoder.encode(stdin).length > 8192) return {state: 'invalid-input'};
    finish('cancelled');
    const spike = window.spike;
    const session = crypto.randomUUID(), job = String(++sequence);
    const started = performance.now();
    spike.state = 'loading'; spike.stdout = ''; spike.stderr = ''; spike.detail = '';
    return await new Promise(resolve => {
      const controller = new AbortController();
      active = {session, job, resolve, controller, started, messages: 0, bytes: 0};
      active.timer = setTimeout(() => finish('unavailable'), options.loadTimeout ?? 30000);
      (cachedParts ? Promise.resolve(cachedParts) : Promise.all([...names.map(async name => {
        const response = await fetch('/runtime/' + name, {signal: controller.signal});
        if (!response.ok) throw new Error('Asset unavailable');
        const bytes = await response.arrayBuffer();
        if (bytes.byteLength > 12 * 1024 * 1024) throw new Error('Asset too large');
        return [name, bytes];
      }), fetch('/worker.mjs', {signal: controller.signal}).then(r => {if (!r.ok) throw new Error('Worker unavailable'); return r.text();})])).then(async parts => {
        if (active?.session !== session) return;
        cachedParts = parts;
        const workerSource = parts[parts.length - 1];
        const assets = Object.fromEntries(parts.slice(0, -1));
        const frame = document.createElement('iframe');
        frame.title = 'Isolated feasibility runner'; frame.hidden = true;
        frame.sandbox = 'allow-scripts';
        active.frame = frame; spike.frames++;
        const channel = new MessageChannel(); active.port = channel.port1;
        channel.port1.onmessage = ({data}) => receive(data);
        frame.onload = () => frame.contentWindow.postMessage({type: 'init', assets, workerSource, session}, '*', [channel.port2]);
        frame.src = '/frame.html'; document.body.append(frame);
        active.source = source; active.stdin = stdin; active.executionTimeout = options.executionTimeout ?? 5000;
      }).catch(() => { if (active?.session === session) finish('unavailable'); });
    });
  },
};
function finish(state) {
  if (!active) return;
  const current = active; active = undefined;
  clearTimeout(current.timer); current.controller.abort();
  window.spike.state = state;
  const result = {state, stdout: window.spike.stdout, stderr: window.spike.stderr, detail: window.spike.detail, version: window.spike.version, python: window.spike.python, heapBytes: current.heapBytes, loadMs: current.loadMs, totalMs: performance.now() - current.started};
  let cleaned = false, cleanupTimer;
  const cleanup = () => {
    if (cleaned) return; cleaned = true; clearTimeout(cleanupTimer);
    current.port?.close(); current.frame?.remove(); window.spike.frames = document.querySelectorAll('iframe').length;
    current.resolve(result);
  };
  if (current.port) {
    current.port.onmessage = ({data}) => {if (data?.session === current.session && data.type === 'disposed') cleanup();};
    cleanupTimer = setTimeout(cleanup, 250);
    current.port.postMessage({session: current.session, type: 'dispose'});
  } else cleanup();
}
function receive(data) {
  const spike = window.spike;
  if (!active || !data || data.session !== active.session || (data.job !== undefined && data.job !== active.job)) { spike.ignored++; return; }
  if (++active.messages > 256) { finish('output-limit'); return; }
  const type = data.type;
  if (typeof type !== 'string' || Object.values(data).some(value => typeof value !== 'string' && typeof value !== 'number') || Object.values(data).filter(value => typeof value === 'string').some(value => encoder.encode(value).length > 20000)) { finish('protocol-error'); return; }
  if (!['ready', 'running', 'output', 'completed', 'runtime-error', 'output-limit', 'unavailable'].includes(type) || Object.keys(data).some(key => !['session','job','type','stream','text','detail','version','python','heapBytes'].includes(key))) { finish('protocol-error'); return; }
  if (type === 'ready') {
    if (spike.state !== 'loading' || typeof data.version !== 'string' || data.version !== '314.0.7' || typeof data.python !== 'string' || data.python.length > 512) { finish('protocol-error'); return; }
    if (!Number.isSafeInteger(data.heapBytes) || data.heapBytes < 0) { finish('protocol-error'); return; }
    spike.version = data.version; spike.python = data.python; active.heapBytes = data.heapBytes; active.loadMs = performance.now() - active.started;
    clearTimeout(active.timer); spike.state = 'running';
    active.timer = setTimeout(() => finish('timeout'), active.executionTimeout);
    active.port.postMessage({session: active.session, job: active.job, type: 'run', source: active.source, stdin: active.stdin}); return;
  }
  if (type === 'unavailable') { spike.detail = typeof data.detail === 'string' ? data.detail.slice(0, 2000) : ''; finish('unavailable'); return; }
  if (spike.state !== 'running' || data.job !== active.job) { finish('protocol-error'); return; }
  if (type === 'output') {
    if (!['stdout','stderr'].includes(data.stream) || typeof data.text !== 'string') { finish('protocol-error'); return; }
    active.bytes += encoder.encode(data.text).length;
    if (active.bytes > 16384) { finish('output-limit'); return; }
    spike[data.stream] += data.text; return;
  }
  if (type === 'running') return;
  if (data.detail !== undefined && (typeof data.detail !== 'string' || data.detail.length > 2000)) { finish('protocol-error'); return; }
  spike.detail = data.detail ?? ''; finish(type);
}
