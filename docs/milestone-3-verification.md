# Milestone 3 — Pyodide Browser Feasibility

Investigation: 12 October 2026; final documentation review: 13 October 2026. Original checkout:
`C:/Users/crate/Documents/ProjectALEVEL`, branch `feat/pyodide-feasibility`.

**Decision: GO for further isolated testing; NO-GO for learner activation.**
Real local Chromium evidence supports the prototype, but the actual deployment,
supported browser engines/physical devices and memory exhaustion have not passed
Gate 3. Local distribution notices and a preview package were prepared on
13 October; the later protected publication and ordinary GET checks are recorded
in [Vercel setup](vercel-setup-2026-10-13.md). Browser/device Gate 3 remains open. CodeMirror/learner controls remain
deferred. The existing theory/quiz/offline-practice/local-progress app is intact.
No commit, push, PR, merge or deployment was performed in the original investigation;
later owner-authorized local commits and developer publication are recorded below
and in the setup record.

## Acceptance and handoff

Acceptance was a pinned real runtime, an opaque isolated context plus worker,
browser-enforced origin/network separation, bounded validated messaging,
termination/recovery, fresh cases, measured loading/resource costs, existing
application checks and an honest activation decision. No mock establishes the
runtime results below.

Read before editing: AGENTS.md, README.md, implementation.md, roadmap.md,
current-status.md, content-guide.md, docs/milestone-workflow.md,
docs/architecture.md, docs/testing.md, docs/decisions/runner-provider.md and
docs/milestone-2-verification.md.

Initial `git status --short --branch` failed inside the docs-rooted sandbox
(`must be run in a work tree`); an explicit-work-tree diagnostic also encountered
permission denial. Elevated read-only status verified the clean feature branch.
HEAD, main and the saved origin/main all matched
`092dc5f3014a64e5a3d6255dac6ecfb784790769`; `main...origin/main` was `0 0`.
The owner reported PR #2's squash merge. No fresh fetch/SSH/hosted check was run.
Backup branch `backup/original-planning-2026-10-12` remained at `516e0dd` and the
older .codex worktree remained intact and untouched. Historical verification
records are retained with a superseding handoff note.

## Runtime, licensing, assets and maintenance

Selected Pyodide **314.0.7**, stable release dated 14 September 2026, after checking
the official [changelog](https://pyodide.org/en/stable/project/changelog.html),
[worker guide](https://pyodide.org/en/stable/usage/webworker.html),
[download guide](https://pyodide.org/en/stable/usage/downloading-and-deploying.html),
[streams](https://pyodide.org/en/stable/usage/streams.html) and
[pinned JS API](https://pyodide.org/en/314.0.7/usage/api/js-api.html).
The real browser runtime reports **CPython 3.14.2**, matching the release family.
Pyodide 314 uses ES modules; the prototype uses an actual module worker.

No npm dependency or service was added. The downloader takes only five files
from the upstream minimal core archive, pins its observed SHA-256 and preserves
unmodified module bytes. No runtime CDN fetch occurs during execution.

| Asset | Raw bytes |
| --- | ---: |
| pyodide.mjs | 17,931 |
| pyodide.asm.mjs | 1,250,344 |
| pyodide.asm.wasm | 9,598,218 |
| python_stdlib.zip | 2,545,637 |
| pyodide-lock.json | 119,077 |
| Total | **13,531,207** (12.90 MiB) |

The download archive is 6,757,104 bytes. Per-file/archive hashes and upstream URL
are retained in [asset-manifest.json](pyodide-spike/asset-manifest.json). The hash
pins an observed download, not an independently authenticated signature.

[MPL-2.0 text](pyodide-spike/PYODIDE-LICENSE.txt) and
[CPython combined licence text](pyodide-spike/CPYTHON-LICENSE.txt) are retained;
tagged source links are in the [runner decision](decisions/runner-provider.md).
Compiled third-party notices and source-availability packaging are now retained
in the local [preview preparation](pyodide-spike/PREVIEW.md) and
[distribution review](pyodide-spike/DISTRIBUTION-NOTICES.md). Review the concrete
package before public distribution; local packaging does not pass deployment gates.
No upstream files were rewritten. The experimental `createPyodideModule` option
and data-module delivery need regression tests and licence/security review on
each update. Review CPython/Pyodide advisories, engine compatibility and changed
asset hashes deliberately; do not silently float the runtime version.

There is no provider execution fee. Uncompressed cold transfers would consume
about 135.3 GB for 10,000 visits, before protocol overhead. HTTP compression,
versioned immutable caching, hosting allowances/free terms and actual delivery
remain deployment work. No permanent zero-cost guarantee is made.

## Isolated prototype

Implementation/reproduction: [harness README](pyodide-spike/README.md).
Everything is under docs/pyodide-spike, outside Next.js routes/public assets.
The loopback server serves fixed GET files, with no execution endpoint, source
upload, telemetry or request logging. Source/stdin travel only through browser
messages. The authored-example Python script executes existing project examples
locally; it is not a submission service.

The trusted host loads fixed same-origin assets only on explicit execution and
keeps bounded runtime bytes for the visit, never learner source/stdin. It passes
bytes through a private MessageChannel into an iframe with
`sandbox="allow-scripts"` only. The frame creates a data-URL module worker;
runtime module URLs and the stdlib blob are created inside that worker.
Main UI CSP stays separate from the permissive JS evaluation required inside
the isolated context. No same-origin/top-navigation/popups/forms grant was added.

Frame response CSP:

```text
default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob: data:;
connect-src blob:; worker-src blob: data:; frame-src 'none';
form-action 'none'; base-uri 'none'; object-src 'none'
```

The data worker inherits this policy. No HTTP CORS permission is needed or
granted: trusted host asset fetches are same-origin and opaque runner HTTP is
denied. Actual asset MIME types, absent ACAO and response CSP were checked locally.
A fixed in-memory Response supplies the dummy WASM URL used by Pyodide bootstrap;
this fetch wrapper is not the security boundary. Native fetch and remote import
bypass attempts still failed with browser CSP evidence.

The host accepts messages only on the capability port, validates session/job,
types/fields, stream names and byte/message budgets, and rejects stale/invalid
responses. No response selects storage keys, HTML or host actions. Results remain
alterable local self-checks; validated messages do not establish trusted grades.

Source cap: 16 KiB UTF-8; stdin: 8 KiB; output: 16 KiB; received messages: 256.
Loading watchdog: 30 seconds; execution watchdog: five seconds after ready.
Tests shorten watchdogs for failure cases. Each case is a separate fresh
interpreter; no multicase batch/editor integration is implemented.

Stop/Reset/failures ask the responsive frame to terminate its worker, wait for
acknowledgement, then close the port/remove the frame. A 250 ms removal fallback
bounds failed cleanup. Real loop tests verify Chromium worker targets disappear;
a promise timeout alone is not the cancellation mechanism.

## Real local outcomes

Windows, Node **20.20.2**, local Python **3.14.5**, Playwright **1.64.0**,
Chromium **156.0.8078.4**. Desktop and Pixel 7/390px emulation use this desktop
browser/CPU. They are not Android/iOS physical-device results or deployed results.
These are single-run development measurements, not a performance benchmark.

The main final run records 95 evidence entries: 45 job outcomes per mode,
frame-boundary/network evidence per mode and one throttled load. A supplementary
run verifies six protocol/recovery outcomes plus CORS/CSP headers. The two extra
protocol cases were added to the main driver after its final full run; they were
executed in that supplementary run. [Reviewed summary](pyodide-spike/evidence-summary.json).

| Check | Actual local result |
| --- | --- |
| Real runtime / stdin / stdout / stderr | Passed both modes; reports pinned runtime/Python. |
| Unicode and output without final newline | Passed after explicit flush fix. |
| Syntax, ZeroDivisionError and input EOF | Bounded runtime-error feedback in both modes. |
| Genuine infinite loop | Host watchdog ends worker; independent recovery succeeds. |
| Stop / Reset during loop | Main event loop remains responsive; cancelled result; worker target disappearance and fresh rerun pass. |
| Output flood / forged oversized output / message flood | Terminated with output-limit; accepted output stays within cap. |
| Fresh jobs/cases | Prior globals and /tmp file absent in next interpreter. |
| Worker DOM/storage/navigation APIs | window/document/parent/localStorage/sessionStorage/cookieStore absent. |
| Opaque-frame boundary | Parent DOM, local storage, cookie access and parent navigation denied; host URL/progress/cookie sentinel survives. |
| HTTP(S) fetch, native fetch, XHR, remote import, WebSocket | Denied; fetch/import failures report CSP; socket never opens. |
| Stale/wrong session and wrong job | Rejected; real result survives. |
| Malformed type / invalid stream | Protocol failure, context cleanup and recovery pass. |
| Oversized UTF-8 source/stdin | Rejected before runtime execution. |
| Loading timeout / blocked download | Unavailable, bounded cleanup and successful retry. |
| Authored models / every visible example | **40 exact stdout comparisons passed**: 20 cases per browser mode across four models. |
| Repeated jobs/failures | No remaining iframe or worker targets at checked cleanup boundaries. |

| Loading/resource observation | Desktop | Pixel 7 emulation |
| --- | ---: | ---: |
| Cold init | 1.855 s | 1.846 s |
| Next warm case, fresh interpreter | 1.820 s | 1.888 s |
| Median initialized-job load | 1.816 s | 1.867 s |
| Warm runtime asset transfer | 0 bytes | 0 bytes |
| Initial WASM linear memory | 30 MiB | 30 MiB |

The 10 Mbps / 80 ms network latency / 4x CPU slowdown CDP simulation initialized
in **13.219 s** and executed successfully. It is emulation, not real mobile
network/device evidence. Cold HTTP body bytes match the uncompressed asset total;
the local server does not compress. Typical small-program execution after ready
took milliseconds. Fresh-runtime initialization dominates per-case cost.

WASM linear memory excludes the retained 13.53 MB host asset buffers, cloned
buffers/data-URL strings, JavaScript heap, compiler and browser overhead. It is
not peak RAM or a memory quota. Memory exhaustion/low-RAM OS behavior is untested.

## Exact commands and checks

All project commands ran from the original project folder. Elevated execution
was needed for root build/install writes and a browser/server sharing loopback.
No SSH-dependent command ran.

| Command | Result |
| --- | --- |
| `git status --short --branch` | Initial sandbox failure; elevated read confirmed clean feat/pyodide-feasibility. |
| `git branch -vv`, `git rev-parse HEAD`, `git rev-parse origin/main`, `git rev-list --left-right --count main...origin/main` | Handoff refs/backup/worktree verified; 0/0 tracking comparison, not fresh remote state. |
| `npm ci` | Installed unchanged lockfile: 461 packages; five high advisory entries. |
| `npm audit --json` | Exit 1; existing development ESLint → fast-glob → micromatch → braces chain, GHSA-vfj7-8cjw-p6xm. No automatic fix/version change. |
| `python docs/pyodide-spike/download.py` | Sandbox DNS failed first; approved retry downloaded pinned core, hashes and licences. |
| `node docs/pyodide-spike/server.mjs` | Static loopback server; initially sandbox server unreachable by elevated browser; same-environment restart resolved reachability. Stopped after verification. |
| `node docs/pyodide-spike/check.mjs` | Final real-runtime run passed (95 records), including throttled run and 40 exact authored comparisons. Earlier failures/fixes below. |
| `node docs/pyodide-spike/protocol-check.mjs` | Six real-worker protocol/recovery checks and header assertions passed. |
| `python docs/pyodide-spike/summarize.py` | Rechecked all 40 stdout results against current content with exact equality; generated reviewed summary. |
| `powershell -NoProfile -File docs/pyodide-spike/verify.ps1` | Runs checks below with NEXT_TELEMETRY_DISABLED=1; final full run passed. |
| `npm run lint` | Passed in full check run and final source check. Initial vendored-source scan failed; corrected cache handling below. |
| `npm run typecheck` | Passed route generation and TypeScript. |
| `npm run check:content` | Six Markdown items validated. |
| `npm test` | 12 passed. |
| `npm run test:examples` | 42 authored Python runs passed locally. |
| `npm run build` | Passed; unchanged theory app/static lesson/exercise routes. |
| `npm run test:e2e` | 24 passed across desktop/mobile Chromium. |
| `python scripts/check-contrast.py` | Eight pairs passed; minimum 5.30:1. |

Build warned about an unrelated parent-directory package-lock.json; the build
completed. NO_COLOR/FORCE_COLOR warnings remain harmless. This run's generated
next-env import-path noise was normalized explicitly without a Git reset/restore.
Final documentation/diff checks are recorded alongside the review summary.

Final review on 13 October: `python docs/pyodide-spike/check-docs.py` passed
whitespace/local-target checks for 11 Markdown files and 44 links, plus absence
of an app execution route/public runtime. `git diff --check` passed. Read-only
status/diff confirmed only milestone documentation and the new developer harness;
package.json, package-lock.json and next-env.d.ts have no diff. A filename-only
`rg -l` scan for common API/AWS key and private-key markers in built static assets
and authored harness JS/HTML/JSON found no match; this is not an exhaustive secret
audit. The loopback server was stopped. Git history/worktrees remain untouched.

## Failures investigated and corrected

- Browser executable/loopback access differed between sandbox and elevated
  processes. Used approved local execution; no SSH or service substitution.
- Blob module worker creation failed in the opaque frame. A minimal probe
  reproduced it; a classic-worker diagnostic started but was not selected.
  A data-URL module worker started, but frame-created blob module imports still
  failed. Creating data modules and the stdlib blob inside the worker resolved
  this while retaining origin isolation and network denial.
- Pyodide prefetches WASM even when a constructor is supplied. A fixed local
  Response resolved bootstrap without adding HTTP permission to the runner.
- A real Unicode/no-final-newline test lost buffered output. Explicit Python
  stream flushing and streaming UTF-8 decoding corrected it.
- Immediate frame removal raced worker cleanup. Acknowledged termination plus
  bounded fallback corrected it; worker target checks now pass.
- An intermediate long-running suite saw a mismatched host/worker protocol after
  files changed during testing; reran with consistent files. No mixed-version
  result is used as final evidence.
- Initial lint scanned vendored compiled runtime and failed. Binary-suffixed
  ignored cache files preserve original bytes/MIME delivery while keeping all
  authored JavaScript under normal lint; no app lint rule was disabled.
- HTTP cache did not reuse the large WASM asset on the next case. Keeping fixed
  asset bytes for the visit removed warm network downloads. Interpreter state
  remains fresh; warm init is still roughly two seconds.

## Remaining gates and precise next action

The local distribution notices and **reviewable, test-only static preview
package/header configuration** were prepared on 13 October 2026. See the
[package review guide](pyodide-spike/PREVIEW.md). Owner review/publication
authorization and actual-host verification are the next gates. No learner
route/editor integration was added; do not publish without explicit authorization.

After that package is reviewed and publication is authorized, obtain the actual
preview URL/host access and rerun the same probes against it. Update the harness's
test URL/paths deliberately; capture actual response CSP/CORS/cache/compression
and failed network probes, real cold/warm transfer sizes, loop termination,
fresh-state/failure recovery and host bandwidth allowance. Never add
allow-same-origin or HTTP runner permission to fix deployment loading.

Run on physical Android Chrome and iOS Safari and intended desktop engines,
recording device/OS/browser versions and cold/warm times. Evaluate low-memory
failure/recovery and select supported browser/device policy from results.
Neither browser emulation nor local headers certify deployment/device safety.

No owner SSH step is currently needed. If a future step needs SSH, ask the owner
to run the exact command in Bash and reply **“Done”**, then wait before dependent
work. Hosted CI, Vercel terms/usage, real deployment, independent educational and
screen-reader review, and branch protection remain unverified here.

This prototype does not establish a strict memory quota, immunity to browser
engine vulnerabilities or denial of every future network-capable API. Structured
clone can allocate a hostile payload before host validation. Coverage here is
the enumerated adversarial attempts, not a universal sandbox proof. Complete the
remaining gates before CodeMirror or learner execution; retain the theory/offline
journey if they fail.

## Local deployment preparation — 13 October 2026

The owner explicitly authorized retaining the existing uncommitted work on
`feat/pyodide-feasibility`, completing notices and creating a local reviewable
package. Elevated read-only Git checks confirmed the expected dirty branch,
no conflicts, unchanged HEAD/main/saved origin/main at 092dc5f and 0/0 tracking
comparison. No fresh fetch was made. No switch, stash, stage, commit, push, PR,
merge, project linking or deployment occurred.

[Preview review guide](pyodide-spike/PREVIEW.md),
[distribution notices](pyodide-spike/DISTRIBUTION-NOTICES.md) and
[package summary](pyodide-spike/preview-summary.json) describe the concrete result.
The final digest-named package is `314.0.7-4c374617b43c`, with **57 public files**,
**16,216,826 raw public bytes**, and an **8,242,613-byte ZIP** containing 59 entries
(public files plus host configuration/package manifest). The ZIP SHA-256 is
`f9fb445acb61f85361da080e7b6dd45a9777272d419dc35b869f61945bf79a17`.
Two final builds produced identical content and ZIP hashes; every ZIP entry
matched the generated directory exactly.

Thirty-nine original notice/vendor files cover the reviewed core build inputs.
The package includes MPL/CPython/project licences and the 1,464,973-byte Pyodide
source archive, including build recipes and CPython patches, accessible through
the notice page. The five runtime files retain their original hashes and
13,531,207-byte total. Optional package wheels and compiler/tool executables
are absent. Archive URLs/hashes and notice paths/hashes are recorded in the
[notice manifest](pyodide-spike/notice-manifest.json). This is a concrete notice
inventory/source-availability package, not a certification of binary provenance.

The generated host changes only `/runtime/` to `/runtime/314.0.7/`; original frame
and worker bytes are preserved. Static Vercel configuration enumerates exact
MIME/CSP/cache headers per file with no CORS permission. The existing opaque
allow-scripts frame/data-worker design remains unchanged. Source/notices are
available without executing Python. No learner editor/Run controls or app routes
were added. All local generated output is ignored; the only new root code/config
change excludes generated `.preview/` assets from ESLint. Authored JS remains
linted. Build-generated type-path noise was normalized explicitly, with no
Git reset/restore; package.json/package-lock.json/next-env.d.ts have no diff.

| Preparation command/check | Actual outcome |
| --- | --- |
| `python docs/pyodide-spike/collect-notices.py` | Initial sandbox DNS failure; approved download succeeded; cached rerun passed with archive hash checks. |
| `python docs/pyodide-spike/build-preview.py` | Final build and repeat passed with identical hashes. A first ZIP filename lost the dotted version suffix; corrected before final packaging. |
| `node docs/pyodide-spike/preview-server.mjs` | Served the generated package at loopback 3191; sandbox/elevated reachability required a same-environment restart. No source upload/execution endpoint. |
| `node docs/pyodide-spike/check-preview.mjs` | Final 57 response hashes, MIME/CSP/cache/no-CORS, notices/source, disabled controls and rejected private/POST paths passed. First sandbox connection was denied; approved rerun succeeded. |
| ZIP/directory equality and SHA-256 assertions | All 59 entries matched exactly; recorded ZIP hash passed. |
| `python docs/pyodide-spike/test-preview.py` | Two disposable-copy tests passed: corrupted core rejected and altered output preserved without overwrite. |
| `powershell -NoProfile -File docs/pyodide-spike/verify.ps1` | Lint/typecheck/content/unit/examples/build passed; e2e had 20 passed and four 30-second timeouts, so the wrapper exited 1 before contrast. |
| `npm run lint` | First scan included generated compiled runtime and failed. Added only a generated-output ignore; final authored-code lint passed. Initial inline edit failed shell quoting before any write; saved script edit succeeded. |
| `npm run typecheck` | Passed route generation and TypeScript. |
| `npm run check:content` | Six content files validated. |
| `npm test` | 12 passed. |
| `npm run test:examples` | 42 authored Python runs passed. |
| `npm run build` | Passed; theory routes only. Existing unrelated parent lockfile warning remains. |
| `npm run test:e2e` | Standalone rerun: 22 passed; desktop/mobile broad layout tests hit the existing 30-second timeout. |
| `npm run test:e2e -- --workers=1 --grep 'published routes fit narrow screens'` | Desktop passed; mobile still timed out at model disclosure visibility. No assertions/timeouts/app code changed. Full e2e is not certified passing for this preparation. |
| `python scripts/check-contrast.py` | Eight pairs passed; minimum 5.30:1. |
| `python -m py_compile docs/pyodide-spike/build-preview.py docs/pyodide-spike/collect-notices.py docs/pyodide-spike/test-preview.py docs/pyodide-spike/summarize-preview.py` | Passed. |
| `node --check docs/pyodide-spike/check.mjs`, `node --check docs/pyodide-spike/check-preview.mjs`, `node --check docs/pyodide-spike/preview-server.mjs` | Passed. |
| `python docs/pyodide-spike/check-docs.py` | 13 Markdown files/55 local links passed before final evidence additions; final count recorded below. |
| `git diff --check` | Passed; dependency/generated-type diff empty; HEAD unchanged. |

The first packaged-runtime browser run failed to launch in the sandbox, then
failed loopback reachability from the elevated browser. After the server restart,
a concurrent run passed early adversarial probes but exceeded the 30-second
loading watchdog in an authored-model case. That run is not passing evidence.
The final runtime rerun is recorded below. Variable local timings and repeated
application layout timeouts remain diagnostic limitations; concurrent load is a
possible contributor, not a proved sole cause.

Final standalone packaged-runtime command (original limits preserved):

```powershell
$env:SPIKE_TEST_URL = 'http://127.0.0.1:3191'
$env:SPIKE_RUNTIME_PREFIX = '/runtime/314.0.7/'
$env:SPIKE_RESULTS_FILE = './preview-results.json'
node docs/pyodide-spike/check.mjs
python docs/pyodide-spike/summarize-preview.py
```

The browser driver exited **0** with **99 evidence records**, including **40
exact authored-model stdout comparisons** (20 per desktop/Pixel 7 emulation),
opaque-frame/network probes, cancellation/worker cleanup, fresh state,
protocol/output limits, recovery and the throttled load. Chromium was
156.0.8078.4. Expected invalid/error/timeout outcomes were asserted by the driver;
they are not suite failures. The retained
[preview evidence summary](pyodide-spike/preview-evidence-summary.json) associates
the result with the final package content/ZIP hashes. Raw results stay ignored;
the original spike results and reviewed summary were not overwritten.
The summary's first read failed under Windows' default text encoding; explicit
UTF-8 fixed it, and the summary rerun passed. Local startup times varied markedly
in this session; no new performance/support claim is made from them.
The loopback server was stopped after verification.

Final documentation check: 13 Markdown files and 61 local links passed;
`git diff --check` passed. Final Git status retained the original uncommitted
feasibility files plus the preparation additions on feat/pyodide-feasibility;
HEAD remained unchanged and dependency/generated-type diffs were empty.

## Layout timeout follow-up — 13 October 2026

This section supersedes the preparation record's unresolved mobile layout
timeout; the earlier failures and runtime evidence remain historical evidence.
The owner authorized investigating and addressing the timeout while preserving
the existing uncommitted feasibility work. Git status confirmed the same dirty
feat/pyodide-feasibility branch at 092dc5f, no conflicts and a 0/0 saved tracking
comparison. No fetch, branch switch, stash, commit or publication occurred.

Acceptance: isolate the timeout cause, retain every published route/width and
layout/disclosure assertion, run the complete browser suite, and keep app/runner
behaviour unchanged unless a specific functional defect is demonstrated.

The unchanged mobile-only reproduction passed in 16.0 seconds. Inspection showed
that the old layout test performed ten routes at each of three widths, including
multiple screenshots and exercise disclosures, under one default 30-second
timeout. Earlier failures occurred in navigation, screenshots, clicks or
visibility assertions as that shared budget expired. A deterministic application
defect was not established by the reproduction. The focused correction makes
each route/viewport an independent test with the same default timeout, preserving
all original assertions, screenshots, widths and desktop/mobile profiles.

Only `tests/e2e/layout.spec.ts` changes test behaviour. No timeout, retry, worker,
browser configuration, app component, CSS, dependency or runner change was made.
The suite now has 82 cases instead of 24 because the two monolithic layout cases
(one per browser profile) become 60 individual cases. This is the same layout
coverage, with separate budgets and useful failure titles; cross-route progress
behaviour remains covered by the existing journey/topic tests.

| Command | Result |
| --- | --- |
| `npm run test:e2e -- --project=mobile-chromium --workers=1 --grep 'published routes fit narrow screens'` | Unchanged reproduction passed: one case, 16.0 seconds, 19.8 seconds overall. |
| `npm run test:e2e` | After the change, all 82 passed across desktop/mobile Chromium in 1.2 minutes, default two workers and unchanged timeouts. |
| `npm run lint` | Passed. |
| `npm run typecheck` | Passed route generation and TypeScript. |
| `npm run check:content` | Six content files validated. |
| `npm test` | 12 passed. |
| `npm run test:examples` | 42 authored Python runs passed. |
| `npm run build` | Passed; theory routes only. Existing parent-directory lockfile warning remains. |
| `python scripts/check-contrast.py` | Eight pairs passed; minimum 5.30:1. |

The non-browser checks above ran sequentially through
`powershell -NoProfile -File docs/pyodide-spike/.runtime/verify-layout-fix.ps1`,
which exited 0. The full passing browser suite was not needlessly repeated.
No verification command failed during this follow-up. An initial source read
used incompatible PowerShell Get-Content arguments; the corrected literal-path
read succeeded and no file was changed by that diagnostic.

Final preservation checks compared the original layout body against the new test
body: every assertion and screenshot is retained exactly apart from indentation.
`git diff --check` and the 13-file/61-link documentation check passed. App,
browser configuration, dependencies and generated-type files have no diff.
Status/roadmap now record the resolved local test budget issue; historical
preparation/runtime evidence is retained. Existing feasibility changes and HEAD
remain preserved on the same branch. No commit, push, PR or deployment occurred.

This local test correction does not
pass deployment, physical-device, screen-reader or learner-execution gates, and
does not change the prepared preview package or its hashes.

Publication, real-host CSP/cache/compression/notice delivery, supported physical
devices/engines, memory exhaustion, host terms/allowances and owner release review
remain open. The local layout-test timeout was resolved by the follow-up above;
all 82 browser tests passed. Learner activation remains NO-GO, and the
theory/offline fallback is preserved.

## Readiness wording correction — 13 October 2026

The owner authorized correcting the stale current limitation after review. The
earlier preparation failures, raw runtime results and dated JSON summaries are
preserved unchanged. In particular, the layout limitation in the original
[preview evidence summary](pyodide-spike/preview-evidence-summary.json) describes
the earlier snapshot; it does not supersede the later passing layout follow-up.

The runtime-only summarizer no longer emits a hard-coded application-layout
limitation. It retains local/emulation, deployment/device and memory limitations;
it does not establish application e2e status. The final status paragraph now
agrees with the resolved follow-up, and the split verification table is repaired.
The existing summary was not regenerated. Future summaries should be generated
in a separate review location to preserve archived snapshots.

Correction checks:

- `python docs/pyodide-spike/.runtime/verify-wording-fix.py`: corrected generator
  passed against copied fresh readiness evidence (99 records/40 comparisons);
  all five evidence/package snapshots retained identical SHA-256 hashes.
- `python docs/pyodide-spike/check-docs.py`: 13 Markdown files/62 local links
  passed. A read-only Python AST parse of the summarizer also passed.
- Application/browser/runtime suites were not rerun for this wording-only fix;
  their latest readiness results remain the previously recorded evidence.

No roadmap gate advanced. The next task remains explicit owner authorization
for developer-preview publication, followed by actual-host verification. Learner
execution remains disabled; no commit, push, PR or deployment occurred.

## Hobby publication preparation — 13 October 2026

The owner confirmed Vercel Hobby, authorized developer-preview publication and
necessary local commits, and retained push/PR actions. The reviewed layout fix
was committed separately at 606b7cd. The remaining feasibility/notice/preview
snapshot is prepared as a second local commit on the same branch; earlier
no-commit records above describe those earlier sessions.

Vercel is now connected. Its authenticated-user API reports active Hobby billing.
The default-team read returned 403 Forbidden, so workspace access, remaining
allowance and model-training opt-out could not be verified. No Vercel CLI is
installed for the mapped fallback. No source was uploaded, project changed or
deployment created. Workspace access is the immediate publication blocker;
hosted adversarial-test permission remains separately unresolved.

Before committing, reran the two disposable-copy packager safety tests, verified
all 59 ZIP entries against the existing directory/hash, checked documentation,
and exercised the corrected summarizer without changing dated snapshots. All
passed. A filename-only scan for common private-key/API-key patterns in authored
harness/script/JSON files had no match (rg exit 1 means no matches); this is not
an exhaustive secret audit. App/dependency/browser-configuration files remained
unchanged. Existing 82-case browser and full project results remain the latest
passing evidence; they were not needlessly repeated.

Windows Git has core.autocrlf enabled. A scoped `.gitattributes` sets `*.txt -text`
for the spike, preserving the exact upstream licence/notice bytes and their
manifest hashes across checkouts. No runtime, notice or package bytes changed.

The first staged whitespace check flagged original upstream notice spacing and
CRLF lines. The same scoped text attribute disables whitespace diagnostics only
for those copied `.txt` licence/notice files; authored Markdown/code remain
checked. The final staged check passed. Staged-blob SHA-256/size checks matched
all 39 notice-manifest records, both main licence files matched their working
bytes, and no cache, ZIP or credential file entered the commit scope.
