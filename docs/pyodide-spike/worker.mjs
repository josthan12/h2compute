// Learner Python only executes here. Worker is born in the opaque frame and
// inherits its CSP, including blob-only connections (no HTTP(S)/WS).
let runtime, session, used = false;
const send = (type, extra = {}) => postMessage({session, type, ...extra});
onmessage = async ({data}) => {
  if (data?.type === 'boot' && !session) {
    session = data.session;
    try {
      const moduleURL = bytes => 'data:text/javascript,' + encodeURIComponent(new TextDecoder().decode(bytes));
      const {loadPyodide} = await import(moduleURL(data.assets['pyodide.mjs']));
      const {default: createPyodideModule} = await import(moduleURL(data.assets['pyodide.asm.mjs']));
      // Preloaded immutable core, no network allowlist usable by learner code.
      const wasmBinary = data.assets['pyodide.asm.wasm'];
      const nativeFetch = self.fetch.bind(self);
      self.fetch = (url, options) => String(url) === 'https://invalid.invalid/pyodide.asm.wasm' ? Promise.resolve(new Response(wasmBinary, {headers: {'Content-Type': 'application/wasm'}})) : nativeFetch(url, options);
      const lockFileContents = new TextDecoder().decode(data.assets['pyodide-lock.json']);
      const stdLibURL = URL.createObjectURL(new Blob([data.assets['python_stdlib.zip']]));
      runtime = await loadPyodide({indexURL: 'https://invalid.invalid/', createPyodideModule, lockFileContents, stdLibURL});
      send('ready', {version: runtime.version, python: runtime.runPython('import sys; sys.version'), heapBytes: runtime._module.HEAPU8.buffer.byteLength});
    } catch (error) { send('unavailable', {detail: String(error).slice(0, 1000)}); }
    return;
  }
  if (!runtime || used || data?.session !== session || data.type !== 'run' || typeof data.job !== 'string' || typeof data.source !== 'string' || typeof data.stdin !== 'string' || new TextEncoder().encode(data.source).length > 16384 || new TextEncoder().encode(data.stdin).length > 8192) return;
  used = true; // Exactly one case per interpreter; host destroys whole frame.
  const job = data.job;
  let total = 0;
  const decoders = {stdout: new TextDecoder(), stderr: new TextDecoder()};
  const write = stream => buffer => {
    total += buffer.length;
    if (total > 16384) { send('output-limit', {job}); throw new Error('output limit'); }
    send('output', {job, stream, text: decoders[stream].decode(buffer, {stream: true})});
    return buffer.length;
  };
  runtime.setStdout({write: write('stdout')});
  runtime.setStderr({write: write('stderr')});
  runtime.globals.set('__source', data.source);
  runtime.globals.set('__stdin', data.stdin);
  send('running', {job});
  try {
    await runtime.runPythonAsync('import sys, io\nsys.stdin = io.StringIO(__stdin)\ntry:\n    exec(compile(__source, "<practice>", "exec"), {"__name__": "__main__"})\nfinally:\n    sys.stdout.flush()\n    sys.stderr.flush()');
    send('completed', {job});
  } catch (error) { send('runtime-error', {job, detail: String(error).slice(0, 2000)}); }
};
