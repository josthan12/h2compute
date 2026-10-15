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

## Gate 3 review and next verification proposal — 13 October 2026

Acceptance for this continuation: review the remaining Gate 3 evidence, decide
the Hobby security-testing boundary from current official policy, and propose
one focused verification step. This is a documentation review, not a runtime
test or activation decision. Read-only elevated Git checks confirmed clean
`feat/pyodide-feasibility` at `a7081611759ea5ec35701578ea87f0609dd9dfa2`,
no unmerged entries and `main...origin/main` at 0/0 against saved refs. The
docs-rooted sandbox reproduced the previously recorded Git status/access errors;
no configuration change or fresh fetch was needed.

The [setup record](vercel-setup-2026-10-13.md) identifies the exact protected
preview and package digest. Its 57 ordinary authenticated GET checks establish
delivered bytes/headers/compression, not runtime or browser-cache behaviour.
The [policy decision](hosting-terms-2026-10-13.md#security-testing-policy-decision--13-october-2026)
blocks hosted adversarial probes on Hobby: no published browser-only exemption
was found. Provider classification of this precise scope has not been obtained.

| Gate 3 evidence | Current position / remaining check |
| --- | --- |
| Pinned runtime, notices and HTTP delivery | Local package and 57 hosted GETs passed; authenticated notice/source access only. |
| Actual-host browser loading and cache | Open: measure startup, browser cold/warm/reload transfers and auth-dependent loading. CDN HIT is not browser-cache reuse. |
| stdin/stdout, errors and fresh execution | Local real Chromium passed; actual-host browser outcomes remain open. |
| Origin/network isolation and message bounds | Local enumerated probes passed; deployed adversarial verification is blocked by the Hobby policy decision. |
| Infinite-loop Stop/Reset, flood limits and recovery | Local passed; deployed adversarial/resource probes remain blocked. Normal successful-job cleanup can be observed in the benign step. |
| Desktop engines and physical devices | Open: intended desktop engines plus physical Android Chrome and iOS Safari, with exact device/OS/browser versions. Emulation is insufficient. |
| Memory/resource behaviour | Open: practical low-memory failure and recovery, peak-resource observations and supported-device policy. WASM linear memory is not total RAM or a quota. |
| Bandwidth and release readiness | Remaining account allowance unverified; independent educational/accessibility review, hosted CI and branch protection remain separate release requirements. |

### Proposed next step: benign hosted Chromium startup/cache check

Prepare a separate driver that runs only three fixed benign jobs against the
exact preview URL in the setup record. Do not point the existing `check.mjs`
at the host: it includes escape/flood probes, hard-coded local environment
wording and a default output path that can overwrite retained evidence.

1. Use one fresh desktop Chromium context with normal caching enabled. Confirm
   accepted existing Vercel authentication and the exact deployment/content
   digest. Keep authentication material outside page JavaScript and apply any
   automation auth header only to the exact preview origin. Never log tokens,
   cookies, raw auth headers, authenticated HARs or storage-state files. Stop
   if access fails; protection changes are outside this step.
   Use authentication that preserves normal caching: Playwright request routing
   disables the HTTP cache, so do not use `page.route`/`context.route` for this
   measurement. See the [official routing note](https://playwright.dev/docs/api/class-browsercontext#browser-context-route).
2. Run a fixed stdin/stdout/stderr example from a cold browser cache, then a
   Unicode/no-final-newline example on the same page. Require exact output,
   Pyodide 314.0.7 / CPython 3.14.2 and normal completion. Observe cleanup after
   each successful job and host responsiveness. Keep the original 30-second
   loading and five-second execution limits; record failure rather than raise
   them. No source supplied by learners is accepted.
3. Reload that page without clearing browser caches and run the first fixed
   example again. Record runtime-file request counts, encoded/decoded/transfer
   bytes, browser cache indicators, startup and total duration separately for
   cold, same-page warm and reload runs. Same-page reuse is retained host bytes;
   reload is a distinct HTTP-browser-cache observation. Do not label a zero
   Resource Timing value a cache hit without corroborating browser evidence.
4. Restrict the pass to these three sequential jobs, with no retry loop, stress,
   scanner, malformed-message, origin escape, outbound-network attempt or
   forced memory exhaustion. At most two complete core downloads are expected
   (cold and reload); halt if traffic departs from this scope. Two transfers at
   the recorded CLI compression size would be 12,848,208 core bytes, excluding
   other resources and headers. This is a planning estimate, not a browser
   measurement or a statement of available account allowance.
5. Save new sanitized evidence under a unique run identifier in ignored
   `.runtime/`, then retain a separate reviewed summary with deployment ID,
   content digest, browser/OS version, exact commands, outputs, timings and
   failures. Preserve all existing raw results, summaries and digest packages.

Pass condition: three exact completed outputs within unchanged limits, correct
runtime versions, no residual runner frame/worker after successful jobs, and
usable measurements for all three cache states without auth disclosure. If
any check fails, diagnose that one failure locally before another hosted run.
The same-page warm job should fetch no core assets; reload cache behaviour must
be recorded as observed, including any unexpected retransfers.

This proposal is ordinary bounded functional/performance QA; it does not infer
a security-test exception. It has not been executed in this continuation. A
passing result would address only hosted Chromium loading/basic I/O/cache and
successful cleanup. It would leave deployed isolation, hostile-job recovery,
other engines, physical devices and memory gates open. The protected developer
preview is also separate from the learner app, so its sentinel checks cannot
certify eventual learner-app integration or progress preservation.

Learner execution remains disabled and Gate 3 remains NO-GO for activation.
No branch switch, push, PR, merge, deployment or protection change was made.

Review validation: `python docs/pyodide-spike/check-docs.py` passed 15 Markdown
files and 77 local targets. Read-only inline Python (`python -`) checked both new
heading anchors. `git diff --check` passed outside the docs sandbox; sandbox Git
diff/status commands failed with the already documented work-tree/access errors.
`Get-FileHash -Algorithm SHA256` before/after comparison preserved all 11 top-level
spike JSON files (including ignored raw results) and five retained preview ZIPs.
Application lint/typecheck/tests/build and runtime suites were not rerun for this
documentation-only proposal. No new hosted execution result is claimed.

## Benign hosted Chromium verification — 15 October 2026

The owner requested continuing Milestone 3 under the autonomous workflow. Initial
read-only Git status was clean at `5393c6b` on `feat/pyodide-feasibility`; no branch
switch/fetch was performed. Acceptance for this focused step was the three-job
proposal above: actual protected-host loading, exact fixed-program I/O, original
limits, cache observations and successful cleanup, with separate preserved
evidence. The wider Gate 3 security/device requirements remain open.

Story: protected static preview → same-origin pinned assets → opaque frame/data
worker → fixed-program output and cleanup. There is no execution API or learner
integration. [Driver and reproduction](pyodide-spike/BENIGN-CHECK.md).

The separate `check-benign.mjs` runs only the fixed stdin/stdout/stderr, Unicode
and reload jobs. It verifies the immutable local package and each executable/core
response's exact hash, original CSP and absent CORS permission. It never imports
the adversarial suite. Three unit tests check host selection, rejection of
insecure/broad cookies, exact outputs, pinned versions and timing limits.

The first CLI `env run` attempt through the PowerShell wrapper lost the command
separator. Direct invocation of the installed CLI entry resolved it. An ordinary
OIDC preflight then returned 302; a value-free local expiry check found the
ignored development token was expired. `env pull .env.local` refreshed it and
the preflight returned 200 with the expected index hash. No redirect was followed
and no Python ran in either preflight. OIDC did not establish a browser session
cookie. The final driver instead reads one already configured automation
credential in memory, exchanges it for an exact-host Secure/HttpOnly cookie and
uses that cookie in Chromium. No credential was created, printed or committed;
protection remained `all_except_custom_domains`. No routing/interception or
cache-disable command was used. Diagnostic source reads with incorrect working
paths were corrected; they changed no files.

The deployment remains `dpl_EtLXtsqjPxkTVUAeaGhwJ6tZQ3BA` / preview / READY at the
exact URL in the [setup receipt](vercel-setup-2026-10-13.md). Package content digest
remains `1825befc25da4421c26bb27cfb625a3f9714220cac2652cbd6bd40a17cd6d3f2`.
Windows `10.0.26200` x64, Node 20.20.2, Playwright 1.64.0 and desktop Chromium
156.0.8078.4. These are single-run development observations, not benchmarks.

| Hosted job | Startup | Total job | Core requests | Core transferSize | Cache evidence |
| --- | ---: | ---: | ---: | ---: | --- |
| Cold stdin/stdout/stderr | 2.616 s | 2.623 s | 5 | 6,422,196 bytes | CDP: none from disk/service-worker cache. |
| Same-page Unicode/no-final-newline | 1.615 s | 1.622 s | 0 | 0 bytes | Retained host asset buffers; fresh successful job. |
| Reload then first example | 1.905 s | 1.913 s | 5 | 0 bytes | CDP: all five responses from disk cache. |

All three exact outputs, pinned runtime/Python reports, host sentinel checks and
zero remaining iframe/worker targets passed. The five cold core responses total
13,531,207 decoded bytes / 6,420,696 encoded body bytes: four Brotli responses and
the stdlib ZIP. `transferSize` is the browser Resource Timing value, including
its reported overhead; it is not a full wire/account measurement. Cached reload
entries retain encoded body sizes while transferSize is zero. The earlier CLI
gzip measurements are preserved and are a different request/compression path.
There were 19 browser GET requests, including 10 core requests across cold and
reload; the session bootstrap and earlier auth preflights are separate requests.

[Retained sanitized evidence](pyodide-spike/hosted-benign-results-20261015.json)
copies the unique ignored hosted run byte-for-byte. Original JSON/manifests,
raw results and all preview ZIPs remain unchanged. The new driver added no npm
dependency, runtime change, CSP/CORS change or learner control.
The retained evidence SHA-256 is
`db2897494bb2a22615bcd58569c074b527d5238d145bca3767a0925c15b61489`;
the executed driver SHA-256 is
`d167dad6ff44c4431c3afcec84704a7ef10821f544490b971465fcd61f2aa338`.

| Command/check | Outcome |
| --- | --- |
| `node --check docs/pyodide-spike/check-benign.mjs` | Passed. |
| `node --test docs/pyodide-spike/check-benign.test.mjs` | Three tests passed. |
| `npx eslint docs/pyodide-spike/check-benign.mjs docs/pyodide-spike/check-benign.test.mjs` | Passed. |
| `npm run lint` | Passed for the repository. |
| `node docs/pyodide-spike/preview-server.mjs` | Unchanged static loopback package server; no execution endpoint. |
| `node docs/pyodide-spike/check-benign.mjs --local` | All three real Chromium jobs passed: 2.240 / 2.120 / 2.185 s startup. |
| `node C:/Users/crate/Documents/ProjectALEVEL/docs/pyodide-spike/check-benign.mjs --hosted` | Passed the three jobs above, with VERCEL_CLI_ENTRY and linked staging cwd as documented. |
| Installed engine availability | Chromium present; Firefox/WebKit absent in the browser-run environment. Sandbox paths differed and were not treated as the installed-runtime inventory. |

The credential diagnostics used direct `node C:/nvm4w/nodejs/node_modules/vercel/dist/index.js`
with `env run -- node <ignored diagnostic>` and
`env pull .env.local --yes --environment development --scope team_Z39ZqQNlBpVBnGnt7ktsEjSc`
in the linked ignored staging directory. Diagnostics emitted only token
presence/expiry booleans, HTTP status/index digest and cookie names, never values.
Application typecheck/unit/content/examples/build/e2e were not rerun: this change
adds only a developer verification driver/tests and evidence/docs, outside the
unchanged app and immutable hosted package. The old full-suite results remain
dated prior evidence; no new full-suite claim is made.

Milestone 3 is still incomplete. Hosted adversarial isolation/cancellation/flood
and protocol probes remain blocked by Hobby policy; provider permission was not
obtained. Other intended desktop engines, real Android/iOS, low-memory recovery,
remaining account allowance and supported-device policy are still unverified.
Physical hardware/provider permission cannot be substituted by this Chromium
run. Further learner integration/activation remains gated. No deployment,
protection change, support message, push, PR or merge was performed.

Final pre-review checks: `python docs/pyodide-spike/check-docs.py` passed 16
Markdown files/92 local targets; `git diff --check` passed. All 16 pre-existing
JSON/ZIP SHA-256 values and every roadmap checkbox state matched the preservation
baseline. The loopback server was stopped. Only verification scripts, the new
sanitized result and related documentation enter the candidate; the existing
learner app, runtime bytes, CSP/protection settings and old evidence are intact.

## Local WebKit compatibility and recovery — 15 October 2026

Task: continue the permitted local feasibility checks while preserving the
original deployment/evidence, learner-disabled state and provider-policy block.
Acceptance for this focused change: diagnose desktop-engine failures; correct
any loading defect without broadening origin/network privileges; verify real
runtime recovery and authored examples; retain separate evidence and package;
record unresolved requirements honestly. This is not Milestone 3 sign-off.

The [desktop guide](pyodide-spike/DESKTOP-CHECK.md) gives reproduction and limits;
[the evidence index](pyodide-spike/local-desktop-evidence-20261015.json) binds six
new byte-identical raw snapshots and current source/driver SHA-256 values.
Original JSON/ZIP evidence is preserved. Failure snapshots remain failures.

WebKit 27.2 could not fetch the original opaque blob stdlib URL and failed to
import Python encodings. The worker now returns preloaded stdlib bytes through
the same fixed-response technique previously used for WASM. Unknown fetches use
native fetch under the existing denying CSP. The wrapper is not the security
boundary; the opaque iframe/data worker and CSP are unchanged. Upstream bytes,
host/frame, credentials, protection, notices and learner controls are unchanged.

| Verification | Actual outcome |
| --- | --- |
| Full current-source Chromium 156.0.8078.4 suite | Exit 0; 99 records, 40 exact authored model/example comparisons; loop cancellation, bounds, state, local security/failure paths and throttle emulation passed. |
| WebKit current-source recovery | Exit 0; 32 records, 20 exact authored comparisons; syntax/runtime/EOF, genuine five-second watchdog, Stop/Reset and recovery, bounded flood, fresh globals/files; one real worker created/closed per record, no remaining frame/worker. |
| Candidate Chromium and WebKit | Three fixed I/O cold/warm/reload jobs each passed; exact runtime versions, 30-second loading/five-second execution limits, original CSP, response hashes/no CORS, core counts 5/0/5 and observed worker cleanup. |
| Candidate delivery | All 57 response/hash/MIME/CSP/cache/no-CORS checks passed; notices/source and disabled controls intact. All 59 ZIP entries equal the candidate directory; content/ZIP digests verified. |
| Firefox 157.0, revision 1555 | Browser launch failed before page load (`spawn UNKNOWN`); Windows SideBySide event 33 identifies missing mozglue assembly. Installed firefox.exe/mozglue.dll match the official ZIP. No Firefox runner result or system repair claimed. |
| Driver/safety checks | Six Node driver tests, repository lint, syntax checks and two disposable-copy packager safety tests passed. |
| Remaining account allowance | Existing installed CLI usage query failed: billing cost data unavailable for 1–15 October; not evidence of zero usage or available allowance. |

The new local package is `314.0.7-a2f184eead72`, content SHA-256
`a2f184eead72face3053c3f6331bbd268081864fe718f83351072acd1eb9c0a7`,
ZIP SHA-256 `b19f784a820b9137b74387558efd017dec02fd3bc37da634a6b37d17cb057dc3`.
Only `public/worker.mjs` and its package manifest changed from the hosted package.
The [new summary](pyodide-spike/stdlib-preview-summary-20261015.json) is separate
from preview-summary.json. It is **not deployed**. Consequently the old hosted
package still has the WebKit loading defect; local success is not a hosted pass.
The preparation helper uses a unique disposable copy and exclusive new outputs
so that the existing builder cannot replace the historical summary in-place.

Commands personally run for this continuation (from the repository root unless
otherwise stated):

```powershell
node node_modules/playwright/cli.js install firefox webkit
node --check docs/pyodide-spike/worker.mjs
node --check docs/pyodide-spike/check-desktop.mjs
node --check docs/pyodide-spike/check-recovery.mjs
node --test docs/pyodide-spike/check-desktop.test.mjs docs/pyodide-spike/check-benign.test.mjs
npm run lint
python docs/pyodide-spike/test-preview.py
node docs/pyodide-spike/check-desktop.mjs firefox
node docs/pyodide-spike/check-desktop.mjs webkit
node docs/pyodide-spike/check-desktop.mjs webkit --source
$env:SPIKE_RESULTS_FILE='./.runtime/stdlib-response-chromium-20261015.json'
node docs/pyodide-spike/check.mjs
Remove-Item Env:SPIKE_RESULTS_FILE
node docs/pyodide-spike/check-recovery.mjs webkit
```

The default Firefox and original-package WebKit commands failed as described;
WebKit source passed after the fix. Source server ran on loopback 3190.
Preparation used the retained ignored session helper before it was promoted to
`prepare-stdlib-preview.py`; packaging and ZIP/file comparison succeeded.
The candidate server on loopback 3191 selected the new summary, then:

```powershell
$env:SPIKE_PREVIEW_SUMMARY='stdlib-preview-summary-20261015.json'
node docs/pyodide-spike/check-preview.mjs
node docs/pyodide-spike/check-desktop.mjs webkit --candidate
node docs/pyodide-spike/check-desktop.mjs chromium --candidate
Remove-Item Env:SPIKE_PREVIEW_SUMMARY
```

Application typecheck/unit/content/examples/build/e2e were not rerun for this
developer-only change; earlier dated full-suite evidence remains unchanged.
The full runtime source suite and additional WebKit checks exercise the changed
worker. Playwright WebKit on Windows is not Safari/iOS or physical-device proof.
WebKit functional recovery is not a full engine-specific isolation audit.

**Owner decision:** keep external contact blocked. The
[generic policy draft](vercel-policy-question-draft.md) stays unsent; no provider
reply or testing exemption exists. No hosted adversarial probes were run.
Physical Android/iOS, supported-engine policy, genuine low-memory/peak resource
assessment, deployed security/recovery and remaining allowance remain unmet.
No gate checkbox advances. No learner activation, protection change, deployment,
branch change, push, PR or merge was performed. Independent review must assess
this focused candidate before a completed-change handoff.

Final pre-review preservation checks: all 17 pre-existing JSON/ZIP SHA-256 values
matched the initial baseline. Documentation checks passed 18 Markdown files and
107 local links; `git diff --check` passed. The preparation helper compiled with
`python -m py_compile docs/pyodide-spike/prepare-stdlib-preview.py`. Both loopback
servers were stopped. All roadmap checkbox states are retained.
