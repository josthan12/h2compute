# Milestone 3 permitted verification — 20 October 2026

Scope: finish available local desktop checks and ordinary protected-preview
loading/I/O, retaining all original evidence. Acceptance: repeatable Firefox
launch without modifying its installed cache or security flags; real recovery
and authored examples; direct browser boundary/message checks on loopback;
bounded desktop resource observations; independent review. Full feasibility and
learner activation still require the remaining deployed/device gates.

The runtime, frame, host, CSP and the two existing preview packages are unchanged.
No npm dependency or service was added. New scripts are developer tools outside
the learner app. The [dated evidence index](continuation-evidence-20261020.json)
binds exact raw results, code hashes, cache provenance and deployment identity.

## Firefox cache and local results

Firefox 157.0, Playwright revision 1555, still fails with `spawn UNKNOWN` from
the original installed cache. Its Windows SideBySide event reports the mozglue
assembly missing, although both expected embedded manifests exist and all 61
installed files equal the official ZIP. A separate fresh extraction of those
exact bytes launches successfully. Both directories have case sensitivity
disabled; the underlying installed-path failure remains undetermined.

`prepare-firefox-cache.py` verifies the fixed official ZIP SHA-256
`410e14bca6099c089c2092df67803320aab70433a754aae356c4c2e990cf6b77`,
checks installed Playwright's Firefox revision/version, extracts only contained
regular files to a unique ignored directory, and copies the existing pinned
winldd-1007 PrintDeps helper. It never changes the installed cache, disables
dependency validation, changes browser flags or downloads anything. Provenance
records all 61 extracted hashes and the helper hash. The extra private cache
consumes local disk and needs occasional cleanup; it adds no provider charge.
The retained ZIP is 129,834,277 bytes. Each preparation creates a separate
363,155,837-byte browser copy plus the 258,560-byte Windows helper rather than
overwriting evidence. The bad-archive test verifies rejection
before any cache is created.

With the private cache, Firefox passed three immutable-candidate startup/I/O jobs
and 32 real source recovery records, including 20 exact authored model/example
comparisons. Those cover syntax/runtime/EOF feedback, a real five-second loop
watchdog, Stop/Reset and subsequent recovery, bounded output and fresh globals/
files. One actual worker is observed created/closed per valid job.

Firefox and WebKit each passed ten local boundary/protocol observations. A
boot-only fixture uses the unchanged real opaque frame and Pyodide worker, held
at ready for direct native-fetch/XHR/WebSocket checks. A real Python-to-JS import
and asynchronous MessagePort callback checks remote module loading without
assuming Python `run_sync` works on every engine. DOM/storage/cookie/parent
navigation access is denied. A separate listening loopback trap has a successful
positive HTTP control and records zero forbidden HTTP requests or WebSocket
upgrades. Real host runs reject stale/wrong-job, malformed/oversized/flooded
messages and oversized inputs, and subsequently recover with no worker/frame
remaining. Progress, host sentinel and location survive.

Initial direct debugger evaluations of `import()` failed in Firefox's automation
context; the real Python/JS callback subsequently returned TypeError with zero
trap traffic. Firefox reports WebSocket denial as NS_ERROR_CONTENT_BLOCKED;
WebKit reports SecurityError. These are recorded observations, not a relaxed
network allowance. No CSP, HTTP allowlist or same-origin permission was added.
This bounded collection does not cover every web API or engine vulnerability.

## Bounded resource observation

`check-resources.mjs` launches a dedicated Chromium instance and queries only
its CDP-reported process IDs. `windows-memory.py` opens query-limited Windows
handles; it neither enumerates other applications nor reads their memory or
command lines. No new Python package is required. It uses Microsoft's
[process counters](https://learn.microsoft.com/en-us/windows/win32/api/psapi/ns-psapi-process_memory_counters_ex)
and [read-only query API](https://learn.microsoft.com/en-us/windows/win32/api/psapi/nf-psapi-getprocessmemoryinfo).

Six fixed jobs cover cold/warm baseline, a touched 32 MiB Python allocation,
fresh state, cancellation during that allocation and subsequent recovery.
The 32 MiB cap belongs only to this diagnostic program: it is not a learner
memory quota. Runtime limits remain 30-second loading/five-second execution.
The driver requires 1,536 MiB initially available physical memory, aborts if
sampled available memory falls below 768 MiB or browser private memory reaches
1 GiB, and has an external per-job deadline. Those sampling guards also are not
dependable instantaneous limits. No forced MemoryError or system exhaustion is
used. Tests cover process-ID scope/bounds and exclusion of partial snapshots
from the reported complete-observation maxima.

The retained final run passed all six jobs with 143 complete snapshots and zero
partial snapshots. Maximum sampled sums were 424,452,096 bytes working set and
337,223,680 bytes private commit; minimum system available memory was
3,553,206,272 bytes. Each job created/closed one real worker with zero remaining
frames/workers; progress survived. Samples target 250 ms spacing but actual
elapsed times are retained. Sums of working sets can double-count shared pages;
sampled maxima can miss transients. Per-process lifetime peak fields are not
summed into a fictitious simultaneous peak. These desktop observations do not
prove low-memory Android/iOS recovery or a safe maximum learner allocation.

## Protected preview continuation

The owner authorized developer-preview publication on 13 October; that specific
authorization is retained by the autonomous workflow. Before refreshing the
preview, read-only CLI checks confirmed the existing workspace remains unblocked
Hobby, the exact project, Vercel Authentication, disabled feedback injection and
no Git link. No account/protection/environment setting was changed.

The already-reviewed package `314.0.7-a2f184eead72` was copied to a fresh ignored
staging directory after recomputing its complete 59-file content digest. A
whitelist excludes everything except its public files and two package metadata
files. CLI published only a preview, using reviewed source commit
`2633e7a4058d828646590e99fc8f30489117feb1` as metadata. The exact package digest,
rather than current uncommitted verification scripts, identifies the upload.

- Preview: [new protected developer harness](https://h2compute-pyodide-preview-poqbeuq87-poopoopeepee.vercel.app).
- Deployment: `dpl_8FWsm9aGym5xyTEqfx846eeWDbmV`, CLI-confirmed preview / READY.
- Package content SHA-256: `a2f184eead72face3053c3f6331bbd268081864fe718f83351072acd1eb9c0a7`.
- Production target remains `dpl_HpYocD7TQe5V6P6nF3RCrLUeXvc2`; no promotion.
- Authentication remains `all_except_custom_domains`; unauthenticated GET
  redirects to protection. Both feedback flags remain false.

The original protected preview and immutable packages remain preserved. The new
driver accepts only this exact new URL/deployment/package and known engine names.
It uses the previously existing automation credential for one exact-host cookie
bootstrap, then Secure/HttpOnly host-specific cookies. It never creates a secret,
adds browser-wide auth headers, intercepts requests, disables CSP/cache, records
traces or exports browser storage. Raw auth/API errors are suppressed. All hosted
programs are fixed small stdin/stdout/stderr examples. No local adversarial driver
is invoked on Vercel.

All 57 ordinary hosted delivery GETs passed response hashes, MIME, cache policy,
original CSP and absent CORS. Chromium, WebKit and Firefox each passed cold,
same-page warm and reload fixed I/O with one observed worker created/closed and
no remaining frame/worker. Core-resource counts were 5/0/5. Startup observations
in seconds were Chromium 6.791/4.972/6.190, WebKit 3.816/5.218/6.634 and Firefox
4.083/3.324/7.012, all within unchanged limits. These are single observations,
not a performance guarantee or proof of all-browser disk-cache behavior.
API-request delivery reads are separate from the browser's cold cache. Raw
Resource Timing sizes are retained; they are not account bandwidth/usage figures.
The old hosted preview remains the old package and its old WebKit failure is
not relabelled. Only the new immutable URL has these three-engine passes.

## Provisional browser policy and remaining gates

Learner Python practice is currently offered on **no browser**. The local target
matrix is Chromium 156.0.8078.4, Firefox 157.0 and WebKit 27.2 on Windows using
existing Playwright 1.64.0. Emulation and Windows WebKit are not physical Android,
iOS or Safari evidence. A release support policy requires actual-host and real
device evidence; this matrix does not exclude devices to waive that requirement.

Milestone 3 remains incomplete: hosted adversarial/security/recovery checks stay
blocked on Hobby, and the owner keeps external contact blocked. No policy post or
support message was sent. Real Android/iOS, genuine low-memory recovery and a
supported-device release decision remain open. CLI usage again returned billing
cost data unavailable for 1–20 October; this is not zero usage or known remaining
allowance. No upgrade, purchase or new service was used. CodeMirror/learner
integration stays gated; there is no push, PR, merge or branch switch.

## Reproduce the permitted checks

From the repository root, with the existing pinned ZIP/runtime/package caches,
Playwright installation and Windows helper present:

```powershell
node docs/pyodide-spike/server.mjs
# Separate terminal: select the unchanged reviewed package on loopback 3191.
$env:SPIKE_PREVIEW_SUMMARY='stdlib-preview-summary-20261015.json'
node docs/pyodide-spike/preview-server.mjs
# Separate terminal: prepare a new private Firefox cache, never replace installed files.
$cacheRecord = python docs/pyodide-spike/prepare-firefox-cache.py | ConvertFrom-Json
$env:PLAYWRIGHT_BROWSERS_PATH=$cacheRecord.cache
node docs/pyodide-spike/check-desktop.mjs firefox --candidate
node docs/pyodide-spike/check-recovery.mjs firefox
node docs/pyodide-spike/check-isolation.mjs firefox
Remove-Item Env:PLAYWRIGHT_BROWSERS_PATH
node docs/pyodide-spike/check-isolation.mjs webkit
node docs/pyodide-spike/check-resources.mjs
node --test docs/pyodide-spike/check-resources.test.mjs docs/pyodide-spike/check-published-candidate.test.mjs docs/pyodide-spike/check-desktop.test.mjs docs/pyodide-spike/check-benign.test.mjs
python docs/pyodide-spike/test-windows-memory.py
python docs/pyodide-spike/test-firefox-cache.py
npm run lint
python docs/pyodide-spike/check-docs.py
```

Hosted fixed checks use the installed authenticated CLI entry via
`VERCEL_CLI_ENTRY`, then `node docs/pyodide-spike/check-published-candidate.mjs
<chromium|webkit|firefox>`; Firefox requires the private-cache environment above.
The Chromium invocation additionally performs exactly 57 ordinary manifest GETs;
each browser is bounded to three jobs, 24 browser requests and ten core requests.
Run engines sequentially. Do not pass a hosted URL to any local boundary,
recovery or resource tool. Stop both loopback servers after verification.

Application typecheck/content/unit/examples/build/e2e were not rerun: learner app,
runtime, content, package and dependencies are unchanged. The actual-engine
checks above exercise the new verification tools; prior full-suite evidence
remains dated historical evidence. Independent review must sign off the final
candidate before a completed-change handoff; it cannot complete missing gates.
