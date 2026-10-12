# Runner strategy decision

**Date:** 12 October 2026
**Status:** Owner-approved planning direction; implementation/activation conditional on browser feasibility. Supersedes the hosted-only proposal. No runtime installed or tested.

## Context and decision

Build theory/quizzes/local progress first, then evaluate **Pyodide** for Python-only browser practice without a per-run provider bill or another backend. Use a replaceable adapter and isolated runner context containing a module worker. Start with single-file stdin/stdout and public examples. Comparisons are inspectable and results are local self-checks.

Pyodide is CPython compiled to WebAssembly under MPL-2.0. Web/JavaScript API access needs deliberate isolation; a worker alone does not separate browser origins. [Project](https://github.com/pyodide/pyodide), [worker documentation](https://pyodide.org/en/stable/usage/webworker.html)

## Required feasibility evidence

- Pin/review the release and Python version; test exercise behavior and deployed browser support. [Compatibility](https://pyodide.org/en/stable/usage/wasm-constraints.html)
- Prefer minimal pinned assets on the existing host, with licences and explicit-use lazy loading. Measure sizes/startup/bandwidth and verify caching/CORS/CSP. No PyScript or new CDN is automatically required.
- Prove frame/worker loading and denial of main-site storage/DOM/cookies, parent navigation and unauthorized network calls. Do not weaken origin separation to fix loading. Validate schema/session/source/channel; opaque null origin alone is insufficient.
- Bound source/stdin/output/messages and use a watchdog. Stop/Reset must terminate loops/flooding, preserve source/progress and recover fresh case/job state. Browser memory is not a strict per-run quota.
- No source/input upload, telemetry, arbitrary packages, shared-code auto-run or trusted-grade claim. Cases and answers are public; no private tests in browser practice.

Targets/contract/gates: [implementation.md](../../implementation.md). Verification: [testing.md](../testing.md).

## Cost and privacy

No execution-provider subscription/quota/API key. Runtime asset transfer still uses hosting allowances and learners supply compute. No extra service absent a measured need and owner authorization. Source/input stay on-device; disclose asset requests and host logs separately.

## Alternatives and fallback

Skulpt has compatibility gaps; PyScript adds a framework layer. Pyodide is selected for feasibility, not a proven runtime. If its gates fail, retain theory/quizzes/offline practice. No silent paid-service substitution.

Judge0/other hosted grading and self-hosted sandboxes are deferred. Keep [earlier hosted-service research](../phase-1-feasibility.md) for later private-test/trusted-grading decisions; its unknowns do not block theory. No /api/run or provider setup now.

## Revisit triggers

Failed isolation/loading, excessive device/startup/bandwidth cost, unavailable required Python behavior, upstream security/compatibility changes, or an approved hosted-grading need. Record actual spike results before checking feasibility tasks complete.
