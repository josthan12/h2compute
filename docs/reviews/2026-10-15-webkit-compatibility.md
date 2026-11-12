# Independent review: local WebKit compatibility continuation

- Review date: 15 October 2026.
- Reviewer: separate agent `/root/webkit_quality_reviewer`, started with a fresh conversation; not an implementation author.
- Scope: focused developer-only loading fix, local desktop/recovery drivers, separate candidate packaging/evidence, and the related status/contact-block documentation. This is **not full Milestone 3 sign-off**.
- Baseline: `fce64d49d5707adc1469a22d6be2568442412842`.
- Exact final reviewed candidate: `2633e7a4058d828646590e99fc8f30489117feb1` on `feat/pyodide-feasibility`.
- Initial candidate: `01a76f25a76dd5fe41e0d7a3f7504679f5b78c59`, an ancestor of the final candidate.
- Reviewed scope: all 28 files between the baseline and final candidate, comprising the initial 27-file change and the `.gitattributes` repair. No implementation changes were made by the reviewer. This receipt is the only tracked-tree addition from this review.

## Independently developed checklist

| Review question | Outcome and evidence |
| --- | --- |
| Is this the authorized local investigation, with an exact stable candidate and no learner activation? | PASS. Read AGENTS.md, README.md, implementation.md (including Gate 3 and browser acceptance), roadmap.md, current-status.md, milestone workflow, independent review protocol, Milestone 3 verification and Vercel setup. Elevated Git inspection found the initial exact candidate and a clean tree before the receipt; final candidate has only this untracked receipt. The 28-file final diff excludes the learner app, curriculum, public assets, application tests, dependencies and activation specification. No branch switch, push, PR, merge or deployment was performed. |
| Does the WebKit workaround remove the loading fault without expanding the sandbox's authority? | PASS for this focused fix. The worker adds only a second fixed preloaded Response for the exact dummy stdlib URL, matching the existing WASM technique. Unknown URLs retain native fetch. Host/frame bytes, CSP, opaque sandbox flags, upstream assets and configuration are unchanged. Fresh WebKit source recovery and candidate loading pass. Fresh full Chromium probes also pass native-fetch, remote-import, WebSocket and frame-boundary denial checks. This is not a complete WebKit or deployed security certification. |
| Do the checks reject false success and observe real execution and cleanup? | PASS. Inspected driver assertions for exact output, pinned runtime/Python, original loading/execution limits, resource counts and unchanged sentinel. The new drivers observe one real worker created and closed, rather than relying solely on an empty final worker set. Independently reproduced three candidate jobs per engine and 32 WebKit recovery records. |
| Do genuine failures recover without retaining interpreter state or blocking the host? | PASS locally. Fresh WebKit run passed a real five-second loop watchdog, Stop/Reset during real loops, successful subsequent jobs, output flood bounds, syntax/runtime/EOF feedback, absent prior globals/files and zero remaining workers/frames per record. Full Chromium regression passed its desktop/mobile emulation cancellation, failure, protocol, bounds and state checks. |
| Are new packages separate, correctly identified and preservation-safe? | PASS. Independently compared both complete package directories: same 59 paths; only `public/worker.mjs` and `package-manifest.json` differ. Recomputed original and candidate content/ZIP digests; all matched their summaries. All 59 candidate ZIP entry bytes equal the directory. Inspected the helper's unique disposable build, fixed local inputs, exact allowed-difference assertion and exclusive destination/archive/summary writes. The helper performs no network download. The original builder and old summary are unchanged by the candidate diff. |
| Is evidence bound to actual files and honest about failure and provenance? | PASS after repair. All six retained snapshots are byte-identical to their indexed raw `.runtime` files and match indexed SHA-256 values and record counts. Current source/driver hashes match the index. Independently compared all 40 retained Chromium and 20 retained WebKit authored outputs with current example metadata. Retained original WebKit loading and Firefox launch failures remain failed, not relabelled as passes. Original failed-run driver hash is explicitly distinct. Fresh checkout filtering with `core.autocrlf=true` now preserves all 13 indexed source/driver/evidence hashes, and packaging in that export reproduces the exact candidate content/ZIP digests. |
| Are drivers bounded and restricted to the authorized local environment? | PASS. Reviewed fixed loopback targets, engine/variant validation, external per-job deadline, bounded diagnostics, exclusive unique result files and failure exit codes. Six driver unit tests pass. Candidate response/hash/CSP/no-CORS checks pass. No new dependency, execution service, learner upload, credential or paid feature is introduced. The imported benign module is not invoked in hosted mode by these drivers. |
| Do the documentation and milestone status accurately describe what remains open? | PASS. New package is explicitly undeployed; the hosted original retains its WebKit defect. Every roadmap checkbox line matches baseline. Milestone 3 stays incomplete; external contact stays blocked and the draft is unsent. Allowance is unknown, not zero. Emulation is not represented as hardware evidence. Application checks are explicitly prior dated evidence, not claimed reruns. Documentation checker passed 18 files and 107 links. |
| Is new educational or learner UI review required for this diff? | Not applicable: no educational content, syllabus mapping, learner UI, progress behavior or learner controls change. Runtime regression still verified the authored examples. Independent educational/accessibility review and physical-device checks remain separate release requirements. |

## Checks personally run

Commands below ran from `C:\Users\crate\Documents\ProjectALEVEL`. Local Git/browser execution required escalation because the docs-rooted sandbox cannot inspect the work tree normally. No external hosting/authentication/usage query was run by this reviewer.

```powershell
git status --short
git branch --show-current
git rev-parse HEAD
git diff --stat fce64d49d5707adc1469a22d6be2568442412842 01a76f25a76dd5fe41e0d7a3f7504679f5b78c59
git diff --name-only fce64d49d5707adc1469a22d6be2568442412842 01a76f25a76dd5fe41e0d7a3f7504679f5b78c59
git diff --numstat fce64d49d5707adc1469a22d6be2568442412842 01a76f25a76dd5fe41e0d7a3f7504679f5b78c59
git diff --check fce64d49d5707adc1469a22d6be2568442412842 01a76f25a76dd5fe41e0d7a3f7504679f5b78c59
git diff --quiet fce64d49d5707adc1469a22d6be2568442412842 01a76f25a76dd5fe41e0d7a3f7504679f5b78c59 -- app components content public tests package.json package-lock.json implementation.md
git rev-list --left-right --count main...origin/main
node --version
python --version
node --check docs/pyodide-spike/worker.mjs
node --check docs/pyodide-spike/check-desktop.mjs
node --check docs/pyodide-spike/check-recovery.mjs
node --test docs/pyodide-spike/check-desktop.test.mjs docs/pyodide-spike/check-benign.test.mjs
python docs/pyodide-spike/test-preview.py
npm run lint
python docs/pyodide-spike/check-docs.py
node docs/pyodide-spike/server.mjs
$env:SPIKE_PREVIEW_SUMMARY='stdlib-preview-summary-20261015.json'; node docs/pyodide-spike/preview-server.mjs
$env:SPIKE_PREVIEW_SUMMARY='stdlib-preview-summary-20261015.json'; node docs/pyodide-spike/check-preview.mjs
node docs/pyodide-spike/check-desktop.mjs webkit --candidate
node docs/pyodide-spike/check-desktop.mjs chromium --candidate
node docs/pyodide-spike/check-recovery.mjs webkit
$env:SPIKE_RESULTS_FILE='./.runtime/review-webkit-quality-chromium-20261015.json'; node docs/pyodide-spike/check.mjs
Get-WinEvent -FilterHashtable @{LogName='Application'; ProviderName='SideBySide'; Id=33; StartTime=[datetime]'2026-10-15'} -MaxEvents 1 | Format-List TimeCreated, Message
Get-NetTCPConnection -State Listen -LocalPort 3190,3191 -ErrorAction SilentlyContinue
```

Results: Git diff/whitespace/scope checks passed; saved main/tracking refs are 0/0 (no fresh fetch). Node 20.20.2, Python 3.14.5. Syntax, six Node tests, two packager safety tests, lint, documentation and all 57 candidate delivery checks passed. Candidate Chromium and WebKit each passed three cold/warm/reload jobs with one worker created/closed per job. WebKit source recovery passed 32 records and 20 authored comparisons. Full current-source Chromium suite exited zero with 99 records, 40 exact authored comparisons and successful throttled startup (14,028.5 ms in this run).

Read-only inspection also used `Get-Content` for the required instructions/plans, complete candidate source/drivers and retained JSON, `git diff` for the complete non-evidence changes, and `rg -n` to inspect build-digest and regression assertions. Supplemental inline `python -` audits personally checked: indexed source/driver hashes; six saved/raw byte and hash comparisons; record counts; original/candidate directory and ZIP equality/digests; current authored stdout expectations; unchanged roadmap checkbox lines; official retained Firefox ZIP digest and installed `firefox.exe`/`mozglue.dll` equality; and the fresh reviewer run record/output counts.

The Windows event independently reports that Firefox activation failed because dependent assembly `mozglue`, version `1.0.0.0`, could not be found. Installed EXE/DLL bytes equal the retained ZIP, whose SHA-256 matches the documented `410e14bca6099c089c2092df67803320aab70433a754aae356c4c2e990cf6b77`. I did not rerun Firefox or change system/browser configuration.

Two exploratory review diagnostics failed and were corrected: initial sandbox Git status returned “must be run in a work tree” (elevated read-only status succeeded); an inline Python evidence audit initially used the Windows default text codec and raised UnicodeDecodeError (explicit UTF-8 rerun passed). Neither changed candidate files. Both reviewer loopback servers were stopped with Ctrl+C after checks; the final port query found no listener on 3190 or 3191. Their interrupt exit status is expected server termination, not a failed runtime check.

## Fresh reviewer evidence

Separate ignored evidence files were created, preserving all implementation evidence:

| File under `docs/pyodide-spike/.runtime/` | Result | SHA-256 |
| --- | --- | --- |
| `desktop-chromium-2026-10-15T09-43-35.184Z-5a4da773-0077-4a9c-a789-0b19353e50b2.json` | 3 passed | `fe4e6df8a9aeae632bbd02f248b8d6630d3c8948c29f4f8d79d8f23fcf581f75` |
| `desktop-webkit-2026-10-15T09-43-35.562Z-066e14a9-2c62-4a71-ac96-7545713b0d72.json` | 3 passed | `6992e09972b07be4d65e2353e5a3c8edd9425be8adc5591b396ee7589428f6d2` |
| `recovery-webkit-2026-10-15T09-43-34.733Z-1907a842-1d6a-4060-88fa-502074f81c80.json` | 32 passed / 20 authored comparisons | `9ce44ff373e9d927801fd14739e9c9d19841509d7e6408ec32f675902c6c1af9` |
| `review-webkit-quality-chromium-20261015.json` | 99 records / 40 authored comparisons; driver exit 0 | `0986047622a2aeda03a6850b987e6976c0df2faff9313a2fb3e7e27629cf6fa1` |

Earlier evidence inspected, not independently rerun: the six indexed implementation snapshots (including original WebKit/Firefox failures), original hosted delivery/benign verification documentation, prior application lint/typecheck/content/unit/examples/build/e2e records, and the account-allowance query result. I did not reproduce the complete historical 17-artifact preservation-baseline audit; tracked historical files are unchanged in this diff, the indexed raw copies match, and both original/current package digests pass my independent audit. The dated preparation helper was not run in-place because its candidate outputs already exist; it was subsequently reproduced in the filtered export during re-review below. The existing builder's two safety tests were reproduced on disposable copies.

## Findings and verdict

After the successful local checks, the implementation agent flagged a final portability concern for independent assessment. I confirmed it was actionable in the initial candidate: `core.autocrlf=true`, while the spike's existing `.gitattributes` protected only `*.txt`. A normal Windows checkout could convert the new retained JSON snapshots from LF to CRLF, invalidating their indexed raw SHA-256 and byte-equality claims. The indexed authored source/driver bytes had the same checkout risk. I issued **CHANGES_REQUIRED** for initial candidate `01a76f25a76dd5fe41e0d7a3f7504679f5b78c59` before handoff.

The implementation agent repaired this in `2633e7a4058d828646590e99fc8f30489117feb1`. The exact three-file repair diff adds six explicit raw-evidence `-text` rules, keeps four indexed source and three indexed driver files at LF, and keeps the packaged distribution notice at LF. The two documentation additions explain the defect and verification. No runtime, driver, evidence, historical snapshot or other packaged bytes changed.

I inspected the complete repair diff and the ignored `verify-checkout.py` helper before running it. It creates a unique export, invokes Git checkout filters with `core.autocrlf=true`, verifies all 13 indexed hashes, copies only the six pinned cache inputs, deletes only the freshly exported dated summary after a resolved-path containment check, and invokes the promoted preparation helper inside the export. It performs no network operation and retains the export. My own rerun passed all 13 hashes and reproduced the exact original candidate content/ZIP digests. Reviewer export: `docs/pyodide-spike/.runtime/checkout-filters-87411e2bcaf047198e86debadddaab38`.

Additional exact re-review commands:

```powershell
git status --short
git rev-parse HEAD
git diff 01a76f25a76dd5fe41e0d7a3f7504679f5b78c59 2633e7a4058d828646590e99fc8f30489117feb1
Get-Content docs/pyodide-spike/.runtime/verify-checkout.py
python docs/pyodide-spike/.runtime/verify-checkout.py
python docs/pyodide-spike/check-docs.py
git diff --check fce64d49d5707adc1469a22d6be2568442412842 2633e7a4058d828646590e99fc8f30489117feb1
git diff --quiet 01a76f25a76dd5fe41e0d7a3f7504679f5b78c59 2633e7a4058d828646590e99fc8f30489117feb1 -- app components content public tests package.json package-lock.json docs/pyodide-spike/worker.mjs docs/pyodide-spike/host.mjs docs/pyodide-spike/frame.html docs/pyodide-spike/index.html docs/pyodide-spike/check.mjs docs/pyodide-spike/check-desktop.mjs docs/pyodide-spike/check-recovery.mjs
git merge-base --is-ancestor 01a76f25a76dd5fe41e0d7a3f7504679f5b78c59 2633e7a4058d828646590e99fc8f30489117feb1
```

These passed, including 18 documentation files/107 links and unchanged runtime bytes. Runtime tests were not repeated after the attribute/documentation-only repair because their exact tested source and packaged bytes are unchanged and the fresh checkout now reproduces them. The original portability finding is resolved; no actionable finding remains for this focused scope.

**SIGNED_OFF** for exact final candidate `2633e7a4058d828646590e99fc8f30489117feb1`, limited to the 28-file local WebKit compatibility continuation described above. This supersedes the initial CHANGES_REQUIRED verdict only for the repaired candidate.

Milestone 3 remains **incomplete**, and learner execution remains disabled. Actual-host security/recovery (hosted adversarial testing remains blocked on Hobby), the undeployed candidate's actual-host compatibility, supported-browser policy/Firefox outcome, physical Android/iOS, practical low-memory/peak-resource assessment and remaining allowance remain open. Independent educational/screen-reader review, hosted CI and branch protection remain release requirements. No provider clarification or external-contact authorization is inferred. This sign-off grants no publication, protection, learner-activation or owner-only Git permission.

Only a following commit containing this receipt verbatim may follow without invalidating this candidate-bound review. Any other change requires a new candidate and re-review under `docs/independent-review.md`.
