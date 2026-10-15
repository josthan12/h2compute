# Local desktop compatibility continuation — 15 October 2026

Developer-only, loopback verification. Learner execution remains disabled. These
scripts accept fixed loopback targets and known engine names, never a hosted URL.
No request routing, authentication, dependency upgrade or CSP relaxation is used.
The installed Playwright 1.64.0 engine downloads add local disk/cache maintenance,
not an npm dependency or paid service. Firefox and WebKit downloads were
123.8 MiB and 60.2 MiB; Chromium was already installed.

## Package and reproduction

The original [preview summary](preview-summary.json) and deployed package
`314.0.7-1825befc25da` are historical evidence. Keep them unchanged.
[The new local summary](stdlib-preview-summary-20261015.json) identifies
`314.0.7-a2f184eead72`, which has **not been deployed**. Only `public/worker.mjs`
and `package-manifest.json` differ across the 59 files. Headers, configuration,
notices, upstream runtime bytes and disabled learner controls are identical.

The worker returns the already-transferred stdlib bytes as a fixed in-memory
Response, as it previously did for WASM. WebKit failed to fetch the old opaque
`blob:null` stdlib URL and could not import Python encodings. The two exact dummy
URLs make no HTTP request. Unknown URLs still use native fetch under the original
denying CSP. This wrapper is a loading adapter; CSP remains the network boundary.
No origin privileges or security boundary are added by the wrapper.

From the repository root, with existing runtime/notices caches, dependencies and
the original digest-verified `.preview/314.0.7-1825befc25da` package:

```powershell
# Only if the exact existing Playwright engine cache is missing:
node node_modules/playwright/cli.js install firefox webkit
# Only on a copy/checkout without the dated candidate summary/output:
python docs/pyodide-spike/prepare-stdlib-preview.py
# Loopback package server, selecting the new candidate (default remains original):
$env:SPIKE_PREVIEW_SUMMARY='stdlib-preview-summary-20261015.json'
node docs/pyodide-spike/preview-server.mjs
```

`prepare-stdlib-preview.py` runs the existing builder in a unique disposable
workspace under ignored `.runtime`, compares every file with the original package,
and refuses to overwrite the candidate directory, ZIP or dated summary. It copies
the pinned cache, notices and project licence; it performs no network request.
Retained disposable outputs can be inspected. Do not run the original builder
in the live checkout: it replaces the original summary.

In a second terminal (the selection variable must be set separately there):

```powershell
$env:SPIKE_PREVIEW_SUMMARY='stdlib-preview-summary-20261015.json'
node docs/pyodide-spike/check-preview.mjs
node docs/pyodide-spike/check-desktop.mjs chromium --candidate
node docs/pyodide-spike/check-desktop.mjs webkit --candidate
node --test docs/pyodide-spike/check-desktop.test.mjs docs/pyodide-spike/check-benign.test.mjs
python docs/pyodide-spike/test-preview.py
Remove-Item Env:SPIKE_PREVIEW_SUMMARY
```

For the current source harness, start `node docs/pyodide-spike/server.mjs` on
loopback 3190 separately, then run `node docs/pyodide-spike/check-recovery.mjs webkit`.
The existing full Chromium suite can use a unique `SPIKE_RESULTS_FILE` under
`.runtime` with `node docs/pyodide-spike/check.mjs`. It includes local adversarial
checks and must never target Hobby. Stop both loopback servers after verification.
`check-desktop.mjs <engine> --source` is available for source diagnostics;
`--package` selects only the original immutable package and requires its server.

## Retained observations

[Evidence index](local-desktop-evidence-20261015.json) binds the six exact raw
snapshots, current source/driver hashes and the candidate digest. Failed original
attempts retain the earlier driver's own hash, distinct from the final driver.

- Chromium 156.0.8078.4: full source suite passed 99 records, including 40 exact
  authored model/example comparisons, loop/stop/reset, output/message bounds,
  fresh state, failure paths and native network denial. Includes Pixel 7 and
  throttle emulation, which are not physical-device evidence.
- WebKit 27.2: source regression passed 32 records, including 20 exact authored
  comparisons, syntax/runtime/EOF feedback, a genuine five-second loop watchdog,
  stop/reset recovery, bounded output and fresh globals/files. Each record
  observed one real worker created and closed, zero remaining worker/frame and
  unchanged host sentinel. This is functional recovery evidence, not a complete
  WebKit isolation/security assessment.
- New immutable candidate: Chromium and WebKit each passed cold, same-page warm
  and reload I/O. Worker cleanup, 30-second loading/five-second execution limits,
  response SHA-256, original CSP and absent CORS grant passed. Core-resource
  counts were 5/0/5. All 57 package response/header checks passed. These are
  single local runs, not a performance guarantee or hosted-cache measurement.
- Original package: WebKit failed loading (stdlib blob denial/missing encodings).
  That failure remains applicable to the unchanged hosted package.
- Firefox 157.0 / Playwright revision 1555: launch failed with `spawn UNKNOWN`;
  direct launch reported Windows side-by-side configuration failure. Application
  SideBySide event 33 identified missing `mozglue` assembly version 1.0.0.0.
  Installed firefox.exe and mozglue.dll match the exact official downloaded ZIP;
  ZIP SHA-256 `410e14bca6099c089c2092df67803320aab70433a754aae356c4c2e990cf6b77`.
  No system files or browser flags were changed. No Firefox harness pass is claimed.

Application typecheck/unit/content/examples/build/e2e were not rerun for this
developer-only change. Their earlier dated results remain prior evidence. New
driver syntax, six driver tests, repository lint and both packager safety tests
passed. The source Chromium and WebKit runs above exercise the changed runtime.

## Still blocked

Milestone 3 remains incomplete: actual-host security/recovery, supported-engine
policy, physical Android/iOS, genuine low-memory/resource assessment and remaining
account allowance are unverified. A 15 October installed-CLI `usage --json` query
returned billing cost data unavailable for 1–15 October; that does not mean zero
usage. No billing settings changed. The owner explicitly keeps external contact
blocked; [the policy draft](../vercel-policy-question-draft.md) stays unsent.
Hosted adversarial probes stay blocked on Hobby. No roadmap gate, protection,
learner activation, deployed package, push, PR or merge changes for this work.
