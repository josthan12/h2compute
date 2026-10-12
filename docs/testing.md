# Testing Strategy

**Updated:** 12 October 2026. Theory first; browser checks are a later activation gate. No application checks run for this documentation edit.

## Theory milestone

- Run relevant TypeScript, lint/format, production build and CI checks once the framework exists.
- Validate metadata, unique slugs, actual 2026 outcomes, publication status and internal links.
- Test quiz normalization/feedback where fair; review explanations/content separately.
- Test local-progress persistence, defensive parsing/schema migration and reset.
- Test authored Python examples locally and review expected results.
- End-to-end: topic → lesson → quiz explanation → offline practice/model explanation → completion → refresh → reset. Include keyboard and narrow-screen use.

No editor/runner is required for theory acceptance; do not claim offline attempts passed executable tests.

## Browser feasibility gate

After theory works, use the actual deployment and intended desktop/mobile browsers. Pin Pyodide/Python; record device/browser/runtime versions, cold/warm asset loading and practical resource costs.

Check supplied stdin, stdout/stderr, syntax/runtime errors and correct/incorrect visible comparisons. Test a separate runtime-loading timeout, a genuine infinite loop, output flooding and Stop/Reset during execution. Verify UI responsiveness, source/progress preservation and a fresh interpreter after recovery. A promise timeout that leaves Python running does not pass cancellation.

Verify cases/jobs do not share globals/files, stale responses cannot overwrite current state, malformed/oversized/wrong-session messages are rejected, and repeated failures do not accumulate workers/listeners. Browser memory cannot be enforced like a hosted quota; assess failure behavior and disclose limits.

## Isolation/security checks

- Learner code never executes in Next.js or the main UI context.
- Verify frame/worker loading with deployed CORS/CSP/sandbox headers; a worker alone does not pass.
- Attempt main-site DOM/local-progress/cookie access, parent navigation and unauthorized network calls using adversarial code. Verify denial rather than relying on disabled UI controls.
- For opaque frames, validate source/channel identity; origin null alone is insufficient.
- Validate message/job IDs, bytes and rate in the host. Output is text, not HTML; messages cannot write arbitrary progress keys.
- Confirm no source/stdin uploads, telemetry or logging. Asset requests/host logs need accurate disclosure.
- Inspect built assets for secrets; browser cases are intentionally public and are not hidden-test leaks.
- Never assert tamper-resistant client grading.
- Review pinned dependencies, advisories and licence notices before release.

## Adapter and end-to-end checks

Use meaningful mocks for UI states/protocol/cancellation failure paths plus real-browser Pyodide smoke checks. Mocks alone do not prove isolation or compatibility.

Exercise explicit Run/Check examples, loading, results, a runtime error, infinite-loop Stop, output flooding, reset/rerun and blocked runtime downloads/unsupported browsers. Theory/quizzes remain usable throughout. Check public-example self-check wording without hidden-test/trusted-grade claims.

## Release gate

Theory beta: relevant content/tests/build/accessibility/deployment checks pass, privacy/coverage limitations are clear, and executable controls remain absent until ready.

Browser practice: all implementation.md Gate 3 and browser acceptance checks pass on deployed supported browsers. Serious isolation/cancellation/output-control failure blocks execution activation; retain theory/offline practice.

Future hosted grading needs separate provider-key/private-test/sanitization/rate/spend/outage/use-permission checks. These are not initial MVP requirements.

## Documentation update verification — 12 October 2026

- `git -C C:\Users\crate\Documents\ProjectALEVEL diff --check`: initially flagged Markdown trailing spaces; cleaned the edited files and reran successfully.
- Bundled Python checked local Markdown link targets across 15 planning files: all targets exist.
- Bundled Python checked implementation sections 1–16 appear once in order and the browser-strategy/deferred-grading requirements are present: passed.
- Read-only Git status/remote/diff review confirmed the origin repository and documentation/configuration-comment edits. Existing research-artifact deletions and docs/tmp changes were preserved.
- No application lint/typecheck/test/build, deployment or runtime spike was run; no application/package scaffold exists yet. No commit or push performed.

## Milestone 1 local checks

The framework and checks now exist. See [milestone-1-verification.md](milestone-1-verification.md) for exact commands, failures corrected, outcomes and remaining deployment/browser-review limits. Run the README commands from the isolated feature worktree; browser tests require a production build first.
