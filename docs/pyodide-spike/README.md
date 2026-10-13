# Isolated Pyodide feasibility harness

Developer-only investigation, outside Next.js routes and public assets. No learner
execution is activated. The server serves fixed static GET resources on loopback;
it never executes submitted Python. No CodeMirror, package dependency, service,
account, telemetry, upload endpoint or grading integration is added.

For the local reviewable static package, retained third-party notices and proposed
host headers, see [preview preparation](PREVIEW.md). Publication and learner
activation remain separately gated.

From `C:\Users\crate\Documents\ProjectALEVEL`, with the existing npm lockfile
installed and Playwright Chromium available:

```powershell
python docs/pyodide-spike/download.py
node docs/pyodide-spike/server.mjs
# In a second terminal:
node docs/pyodide-spike/check.mjs
powershell -NoProfile -File docs/pyodide-spike/verify.ps1
```

The downloader pins Pyodide 314.0.7, checks the recorded archive SHA-256 and
extracts only five core files into ignored `.runtime/`. Cached files have a `.bin`
suffix so repository lint does not scan vendored compiled JavaScript; the static
server uses the original MIME types. It retains Pyodide's MPL-2.0 and CPython's
combined licence text. The hash records an observed upstream archive, not an
independently authenticated signature. The runtime reports CPython 3.14.2.

The trusted host loads fixed same-origin runtime assets on explicit `execute`,
retains the bounded asset bytes for this visit (never learner source/stdin),
then transfers bytes through a private MessageChannel to an iframe with only
`sandbox="allow-scripts"`. A data-URL **module** worker is created there. Module
URLs are created inside the worker; its stdlib blob also belongs to the worker.
No `allow-same-origin`, top navigation, popups or forms are granted.

The frame response CSP is:

```text
default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob: data:;
connect-src blob:; worker-src blob: data:; frame-src 'none';
form-action 'none'; base-uri 'none'; object-src 'none'
```

The data worker inherits this policy. HTTP(S), WebSockets, remote module imports
and nested HTTP workers are denied by the browser. `unsafe-eval` is confined to
the isolated context, whose code is untrusted already; main UI CSP does not grant
it. Bootstrap maps exactly one dummy WASM URL to preloaded bytes using a local
Response. This fetch wrapper is **not** the network security boundary: tests also
exercise the native WorkerGlobalScope fetch and dynamic import under CSP.
Experimental `createPyodideModule` supplies the unmodified core constructor.

No cross-origin runtime request is needed; no ACAO header is granted. Host fetch
is same-origin and opaque-frame/worker HTTP is denied. Do not enable CORS to
allow learner requests. Deployment must reproduce this design and its headers,
with versioned asset URLs, and rerun the actual-browser tests before activation.

Every case creates a fresh interpreter. Host limits are 16 KiB UTF-8 source,
8 KiB stdin, 16 KiB output, 256 incoming messages, 30 seconds loading and five
seconds executing (test overrides shorten watchdogs). A separate capability port
establishes source identity; session/job validation rejects stale messages. Stop,
Reset and failure recovery request worker termination from the still-responsive
frame, then remove the frame; a 250 ms cleanup fallback prevents a stranded frame.
The tests inspect Chromium targets to verify loop workers disappear. No runtime
message can read/write progress or inject HTML. There is no multicase batch API.

Run outputs are inspectable local self-checks. A learner can falsify output/result
messages; validation never makes them trusted grades. Browser-enforced network
and origin boundaries matter even if learner code replaces Python/JS handlers.
Browser memory and pre-validation structured-clone allocation cannot be strictly
bounded. Memory exhaustion, engine vulnerabilities, all network-capable APIs,
physical devices and hosted headers are not proved safe by this prototype.

`results.json` is generated local evidence, ignored by Git. See
[Milestone 3 verification](../milestone-3-verification.md) for the reviewed
snapshot, command outcomes, failure history and activation decision.
