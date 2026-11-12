# Independent review: permitted desktop, resources and protected preview

- Date: 20 October 2026.
- Reviewer: `/root/remaining_m3_reviewer`, a separate reviewer agent started with a fresh conversation; not an implementation author.
- Scope: focused continuation only, all 29 files in the baseline-to-candidate diff. Private Firefox preparation, local boundary/protocol and bounded resource diagnostics, fixed protected-preview driver, retained evidence and documentation. **This is not full Milestone 3 sign-off.**
- Baseline: `5824b428f64f86c7f6d4b4d1a8215aba6d4c714a`.
- Exact reviewed candidate: `8c3a28e9cb828d39b2c40e498b06c0505ec7d897`, branch `feat/pyodide-feasibility`.
- Git state: clean at entry and after all reproduction checks, before writing this receipt. No implementation edit, branch switch, commit, push, PR, merge, publication, external message, configuration change or learner activation was performed by this reviewer. Only this receipt is a tracked-tree addition; new diagnostic results/cache/checkout export remain ignored.

## Independently developed checklist

| Review question | Outcome and evidence |
| --- | --- |
| Does the result respect the authorized task and preserve the learner gate? | PASS for the focused continuation. Read AGENTS.md, README.md, implementation.md including Gate 3 and browser acceptance, roadmap.md, current-status.md, milestone-workflow.md, independent-review.md, milestone-3-verification.md and continuation guides. Inspected the actual full changed-file inventory and code/documentation diff. No app, content, dependency, runtime, frame, host, CSP, package or learner control changes occur. Roadmap checkbox lines equal baseline. The remaining milestone requirements are expressly open. |
| Is Firefox preparation repeatable without weakening or altering installed browser security? | PASS. Inspected the pin, version/revision assertion, contained exclusive extraction and symlink rejection, unique cache directory, existing winldd helper copy and provenance. Independently prepared another private cache, then actually launched Firefox using it. All 61 retained cache file hashes equal both provenance and the pinned official ZIP; helper hash matches. No download, installed-cache overwrite or security flag change is present. The original installed-path failure remains unresolved and is not represented as repaired. |
| Do the boundary checks exercise real isolated browser code and distinguish denial from an unreachable test endpoint? | PASS locally. Fresh Firefox and WebKit each passed ten observations. The listening loopback trap positive HTTP control passed; forbidden HTTP and WebSocket upgrade counts were zero. Real opaque frame denies parent DOM/storage/cookie/navigation access; actual worker denies native fetch, XHR, WebSocket and remote module import. The latter uses actual Python-to-JS and an asynchronous port callback rather than assuming debugger import evaluation works. Host sentinel/location/progress survive. This bounded API collection does not certify every API, browser exploit or hosted deployment. |
| Do protocol failures, limits and cleanup produce meaningful evidence rather than false success? | PASS locally. Inspected stale/wrong-job, malformed/oversized/flooded messages, input bounds, worker creation/closure and recovery assertions. Fresh Firefox recovery passed 32 records and 20 exact authored comparisons, including syntax/runtime/EOF errors, real loop timeout, Stop/Reset and subsequent recovery, output bounds and fresh globals/files. Fresh Firefox candidate passed all three startup/I/O jobs. All valid jobs observe one actual worker created and closed, with no residual frame/worker. |
| Are resource observations bounded, correctly scoped and truthfully interpreted? | PASS for desktop observation. Python opens query-limited handles for the explicit bounded/deduplicated CDP PID list and closes them. The driver requires initial available memory, monitors available/private-memory abort guards and uses fixed 32 MiB touched allocation, deadlines and cleanup. Fresh six-job Chromium run passed with 142 complete samples and zero partials. Sampled maxima were 448,073,728-byte working-set sum and 359,620,608-byte private-commit sum; minimum available physical memory was 2,435,522,560 bytes. Documentation correctly distinguishes sampled sums, shared-page double counting, missed transients, diagnostic bounds and genuine device/low-memory limits. No OOM was forced; no learner quota is claimed. |
| Is the hosted tool confined to permitted ordinary delivery and fixed jobs, without leaking credentials? | PASS by code/evidence inspection, not independent hosted execution. Fixed exact URL/deployment/package, own-property engine selection, preview/READY and project protection/feedback assertions, existing credential bootstrap, Secure/HttpOnly host cookies, no global auth headers, no interception/CSP bypass/tracing/storage export and suppressed raw auth errors are present. Programs are three fixed small I/O examples; no adversarial, cancellation, flood or memory program is run on Vercel. The raw retained hosted results report 57 ordinary GET checks and three jobs per engine. The sanitized deployment receipt records unchanged protection/production target, no credential creation, Hobby and unavailable usage. I did not independently query the provider or repeat these hosted results. |
| Are package and evidence identities reproducible and historical results preserved? | PASS. Recomputed the complete 59-file candidate content digest and ZIP digest; both match the previously reviewed package summary. All eight retained new snapshots equal their named raw files byte for byte. Checked outcomes, record counts, available source hashes and worker cleanup against the evidence index. All 20 indexed source/driver/evidence/provenance/receipt hashes survive a fresh core.autocrlf=true checkout export. Independently compared all 17 pre-existing tracked spike JSON/ZIP Git blobs between baseline and candidate; none changed. This tracked inventory is narrower than the primary agent's 26-file local retained-artifact inventory, which is inspected evidence rather than a separately recreated initial working-tree baseline. |
| Are tests, documentation and delivery claims maintained without invented passes? | PASS. Eight Node tests, both Python tests, repository lint, documentation validation and baseline-to-candidate whitespace check passed independently. Documentation labels historical failures, real-device/hosted limits, single-observation timing, unavailable usage and unchanged app checks honestly. No dependencies or services were added. Full app checks need no rerun for this developer-tools/docs-only diff; their earlier results remain historical evidence. |
| Are new educational content and learner UI reviews applicable? | Not applicable to the diff: no syllabus mapping, educational text, learner UI or progress implementation changes. Authored model examples were still independently executed in the local Firefox recovery suite. Physical devices and independent educational/accessibility review remain release requirements. |

## Commands personally run and results

Commands ran from `C:\Users\crate\Documents\ProjectALEVEL\docs` unless stated otherwise. Git/browser checks and private-cache preparation used elevated execution where the docs-root sandbox could not reach the repository/browser environment. No provider credentials were created or exposed.

```powershell
git -C C:/Users/crate/Documents/ProjectALEVEL status --short
git -C C:/Users/crate/Documents/ProjectALEVEL rev-parse HEAD
git -C C:/Users/crate/Documents/ProjectALEVEL rev-parse --abbrev-ref HEAD
git -C C:/Users/crate/Documents/ProjectALEVEL diff --stat 5824b428f64f86c7f6d4b4d1a8215aba6d4c714a 8c3a28e9cb828d39b2c40e498b06c0505ec7d897
git -C C:/Users/crate/Documents/ProjectALEVEL diff --name-only 5824b428f64f86c7f6d4b4d1a8215aba6d4c714a 8c3a28e9cb828d39b2c40e498b06c0505ec7d897
git -C C:/Users/crate/Documents/ProjectALEVEL diff --check 5824b428f64f86c7f6d4b4d1a8215aba6d4c714a 8c3a28e9cb828d39b2c40e498b06c0505ec7d897
node --test pyodide-spike/check-resources.test.mjs pyodide-spike/check-published-candidate.test.mjs pyodide-spike/check-desktop.test.mjs pyodide-spike/check-benign.test.mjs
python pyodide-spike/test-windows-memory.py
python pyodide-spike/test-firefox-cache.py
python pyodide-spike/check-docs.py
npm --prefix .. run lint
python pyodide-spike/.runtime/verify-continuation-checkout.py
python pyodide-spike/prepare-firefox-cache.py
node pyodide-spike/server.mjs
$env:SPIKE_PREVIEW_SUMMARY='stdlib-preview-summary-20261015.json'; node pyodide-spike/preview-server.mjs
node pyodide-spike/check-resources.mjs
$env:PLAYWRIGHT_BROWSERS_PATH='C:\Users\crate\Documents\ProjectALEVEL\docs\pyodide-spike\.runtime\firefox-cache-517d4c30cbc84b2085226b85707026e4'; node pyodide-spike/check-isolation.mjs firefox
$env:PLAYWRIGHT_BROWSERS_PATH='C:\Users\crate\Documents\ProjectALEVEL\docs\pyodide-spike\.runtime\firefox-cache-517d4c30cbc84b2085226b85707026e4'; node pyodide-spike/check-desktop.mjs firefox --candidate
node pyodide-spike/check-isolation.mjs webkit
$env:PLAYWRIGHT_BROWSERS_PATH='C:\Users\crate\Documents\ProjectALEVEL\docs\pyodide-spike\.runtime\firefox-cache-517d4c30cbc84b2085226b85707026e4'; node pyodide-spike/check-recovery.mjs firefox
```

All successful diagnostic commands exited 0; server processes were explicitly stopped afterwards. Node tests: 8 passed. Python: 1 test per script passed. Documentation: 19 Markdown files and 116 local links passed, with no learner app runner route/public runtime. Lint and Git whitespace checks exited 0. Checkout verification reports 20 indexed hashes preserved; export remains at `.runtime/continuation-checkout-91bc5330069e45169a2f8ca84c50f9e0`.

Reviewer-generated raw files under `docs/pyodide-spike/.runtime/`:

- `resources-2026-10-20T05-50-28.583Z-f1b3ca7f-0820-41e9-8560-9bf69114e410.json`: passed, six jobs, 142 complete samples.
- `isolation-firefox-2026-10-20T05-50-58.500Z-557a3186-6a22-4baf-b2c1-1e9173dc5ac1.json`: passed, ten observations, zero forbidden trap requests/upgrades.
- `desktop-firefox-2026-10-20T05-51-27.379Z-eced3e27-6fdc-48fd-9b26-391c3445aa48.json`: passed, three jobs.
- `isolation-webkit-2026-10-20T05-52-07.703Z-4867091e-ea32-4c32-bc08-2391e85f19cb.json`: passed, ten observations, zero forbidden trap requests/upgrades.
- `recovery-firefox-2026-10-20T05-52-20.602Z-13b54473-aecf-4443-98c5-e4a2e2b6c896.json`: passed, 32 records and 20 authored comparisons.

Additional successful inline Python inspections used PowerShell here-strings piped to `python -` with `PYTHONUTF8=1`: recomputed package content/ZIP hashes using the builder's sorted path-plus-digest algorithm; compared the 17 tracked historical JSON/ZIP Git blobs using `git ls-tree` and `git show`; parsed all eight new evidence snapshots for index counts/outcomes/source/cleanup and unchanged roadmap checkbox lines; compared each retained snapshot with its raw filename; compared every retained Firefox file against the pinned ZIP/provenance and helper hash; parsed all five reviewer raw results for explicit passed outcomes/counts. These were read-only assertions, not changes to project tests.

Earlier unsuccessful review attempts are retained and do not count as passes:

- Non-elevated Git could not change to the parent repository; elevated read-only retry succeeded.
- Non-elevated cache preparation could not find winldd in the sandbox-specific LOCALAPPDATA; elevated preparation found the existing helper and succeeded without changing installed files.
- The initial resource browser could not reach a server started in a different sandbox environment. It failed before any jobs and wrote `resources-2026-10-20T05-49-45.471Z-99a470a3-b6a4-49c9-b618-ec6006d0f975.json`. Stopped those servers; started loopback servers in the same environment as the browser; the complete rerun passed.
- An ad hoc historical-byte assertion initially compared Git LF blobs to pre-existing Windows-converted working files and then assumed the primary agent's broader local inventory had 26 tracked files. The corrected comparison used baseline/candidate Git blobs and the actual 17-file tracked inventory. One parsing retry used default cp1252 and failed on retained multilingual UTF-8; explicit UTF-8 passed. These were reviewer script assumptions, not candidate defects.
- An exploratory PowerShell glob supplied literally to rg failed to match a review filename; reading the exact file succeeded.

Both loopback servers I started were stopped. A bounded fetch check confirmed ports 3190, 3191 and 3192 closed. Hosted reproduction, provider queries, full application typecheck/content/unit/examples/build/e2e and the older full Chromium suite were not run by this reviewer. Hosted observations and provider state are inspected primary evidence only, not independently rerun claims.

## Findings, history and verdict

No actionable correctness, security or focused-acceptance finding remains. No implementation repair or re-review was required for this candidate. The diagnostic/environment failures above were not substituted for passing evidence.

**Verdict: SIGNED_OFF for the exact candidate and 29-file focused continuation scope only.** The primary agent may add this receipt verbatim in a record-only commit. A subsequent implementation/documentation change outside this receipt requires a new candidate and re-review.

Milestone 3 remains incomplete and learner activation remains NO-GO. Actual-host adversarial/security/recovery checks remain blocked under the retained Hobby policy decision; the owner keeps external contact blocked. Physical Android/iOS, genuine low-memory recovery/practical device limits, a supported-device release decision and current remaining account allowance remain unverified. CodeMirror/learner integration, broader release evidence and owner-controlled push/PR/merge/activation are not authorized by this sign-off. No milestone checkbox or missing gate is waived.
