# Current Status

**Last updated:** 15 October 2026
**Overall status:** Milestones 1 and 2 merged; Milestone 3 feasibility investigation with a separate protected developer preview deployed. Browser activation is NO-GO pending deployment/device gates.
**Implementation:** The original three-lesson theory/quiz/offline-practice journey and versioned local progress remain intact. A developer-only Pyodide prototype lives in docs/pyodide-spike, outside Next.js routes/public assets. See [Milestone 3 verification](docs/milestone-3-verification.md) for exact evidence and limitations.

## Confirmed decisions

- MVP remains Python, algorithms/data structures and relational databases/SQL.
- Account-free theory/quizzes/offline practice and local progress remain usable.
- Pyodide 314.0.7 / CPython 3.14.2 is pinned for the local spike; no npm runtime/editor dependency or service is added.
- Runner isolation is an opaque allow-scripts iframe plus a data-URL module worker with browser-enforced HTTP/WS denial. A worker alone is not isolation.
- Source/stdin stay in browser messages. Visible results are local self-checks, not trusted grades.
- CodeMirror and learner integration stay deferred. No execution API, hosted grading, accounts, database, analytics, payment or paid service.
- No official affiliation or full-syllabus coverage claims.

## Working arrangement — 15 October 2026

The owner delegates routine milestone planning, implementation, debugging, applicable checks, documentation, evidence, focused local commits and draft PR descriptions to the agent. The owner reviews the completed milestone, pushes and opens the PR. Do not hand routine development/testing back to the owner or ask for approval of each small step. Preserve existing authorization boundaries and report genuine blockers accurately.

Every completed change/milestone handoff requires a separate reviewer agent, its independently developed checklist and explicit sign-off on the candidate commit. Fix findings and obtain re-review before presenting completion; retain the review receipt under docs/reviews/. See [workflow](docs/milestone-workflow.md) and [independent review protocol](docs/independent-review.md). Scoped documentation sign-off does not complete Milestone 3. Hosted adversarial testing, physical-device evidence and learner activation remain gated; no roadmap checkbox advances for this workflow update.

## Verified Git handoff

Work is in C:/Users/crate/Documents/ProjectALEVEL on feat/pyodide-feasibility. At the start of the original feasibility investigation, elevated Git status was clean. At the 13 October preparation continuation, the expected uncommitted work was present; the owner explicitly authorized preserving it on this branch. At the initial handoff HEAD, local main and saved origin/main matched 092dc5f; main...origin/main is 0/0. The owner reported squash-merging PR #2. No fresh remote fetch or hosted CI verification is claimed. Backup branch backup/original-planning-2026-10-12 remains at 516e0dd. The older .codex worktree remains intact and untouched.

The owner authorized local Milestone 3 commits; the layout-test correction is committed at 606b7cd, and the preparation snapshot is recorded in the following local commit on the same branch (see git log). Local main/saved origin/main remain at 092dc5f. No push, PR or merge has been performed; pushing and PR creation remain owner actions. The later owner-authorized developer preview is recorded below. SSH commands must be requested from the owner in Bash, with a reply of “Done”, before dependent work continues.

## Remaining work and next action

1. Review the isolated prototype, local evidence and [prepared preview package](docs/pyodide-spike/PREVIEW.md). Retained upstream notices and Pyodide source availability are packaged locally; release review remains required. Activation is blocked by actual-host headers/loading, supported browsers/physical devices and practical memory limits.
2. The owner authorized developer-preview publication and necessary local commits on 13 October; pushing and PR creation remain owner actions. [Hosting terms research](docs/hosting-terms-2026-10-13.md) is complete. CLI access verified active Hobby and the correct workspace; the owner confirmed model-training opt-out. Monitor remaining usage and personal/non-commercial eligibility. The current official policy excludes Hobby pentesting; no browser-only exemption was found, so hosted adversarial probes remain blocked pending explicit provider clarification. The next proposed verification is three benign hosted Chromium jobs measuring startup/basic I/O and cold/warm/reload cache behaviour; see the latest Gate 3 review in docs/milestone-3-verification.md. That proposal has not been executed. Local commits are authorized; learner execution remains disabled. The [Vercel setup record](docs/vercel-setup-2026-10-13.md) records the protected preview and all 57 ordinary authenticated GET checks. CLI workspace access works; MCP workspace reads remain blocked by 403. Browser execution, recovery and device gates remain open.
3. Obtain real-device Safari/iOS and Android evidence and choose an honest supported-browser policy. Emulation is not device evidence.
4. Add CodeMirror and learner-facing Run/Check examples only after the full feasibility/activation gate passes; preserve theory/offline fallback.
5. Independent educational/screen-reader review, host free terms, deployment and branch protection remain release requirements.
6. The local layout-test timeout follow-up is resolved: split the ten-route/three-width matrix into independent cases with unchanged 30-second limits and assertions. All 82 desktop/mobile Chromium tests passed. Physical-device and independent accessibility review remain release requirements; see the follow-up in docs/milestone-3-verification.md.

Existing npm audit reports five high-severity entries tracing to the development-only ESLint braces chain. No automated dependency changes were made. Pyodide compute has no provider fee, but the 13,531,207-byte uncompressed core consumes host bandwidth; no promise of permanent zero-cost hosting.

Local preparation verification: all 57 packaged response/hash/header checks and two packager safety tests passed. The final Chromium runtime suite passed with 99 evidence records and 40 exact authored comparisons; see [preview evidence](docs/pyodide-spike/preview-evidence-summary.json). Lint, typecheck, content validation, 12 unit tests, 42 local Python runs, production build and contrast checks passed. The later layout-test follow-up passed all 82 browser cases; it supersedes the preparation session's unresolved timeout. No deployment/device safety is claimed. The loopback server is stopped.

## Change log

- 2026-10-15: Owner authorized autonomous milestone delivery with final owner review/push/PR, focused local commits and a mandatory independent agent review/sign-off before completed handoffs. Recorded the authority boundaries, reviewer checklist/repair loop and candidate-bound review receipt protocol. Milestone 3 gates and existing evidence remain unchanged.

- 2026-10-12: Initial planning and priority-topic beta documented.
- 2026-10-12: Syllabus/hosting/Judge0 research completed; theory-first fallback proposed.
- 2026-10-12: Owner approved theory-first work and reported repository/remote setup.
- 2026-10-12: Owner requested the Pyodide planning revision. Updated runner architecture, content/test rules, acceptance gates and implementation sequence; application work remains unstarted.
- 2026-10-12: Saved the reusable milestone/Git workflow and continuation prompts; linked contributor/roadmap/build documents. Owner authorized the docs branch while preserving existing changes. No application implementation or publication.

- 2026-10-12: Implemented the first complete theory learning journey on the isolated feat/project-setup worktree. Updated setup, coverage, validation, local progress, tests and CI configuration. No deployment or browser runner; see the verification record for exact checks and limits.

- 2026-10-12: Owner requested Tailwind CSS with daisyUI during Milestone 1. Converted the existing shared journey controls and notes layout, exact-pinned local CSS build dependencies, and documented the choice in docs/decisions/ui-styling.md. The runner remains deferred.

- 2026-10-12: Owner committed/pushed and squash-merged Milestone 1 PR #1, reporting passing GitHub checks. Verified merged origin/main at b3fd8da and synchronized clean local main while preserving the original dirty planning checkout.
- 2026-10-12: Owner requested Milestone 2. Added loop and combined-flow lessons/tasks, previous/next links, explicit partial coverage, version 1 → 2 progress migration and multi-lesson tests on feat/python-control-flow. No new dependency, runner, deployment or publication.
- 2026-10-12: Fixed a review finding where failed-save memory survived another tab's reset and could restore old progress. Desktop/mobile regressions cover owned-key reset and site-storage clear followed by successful saving. Lint, typecheck, 12 unit tests, build and all 24 browser tests passed; changes remain uncommitted.

- 2026-10-12: Verified the owner’s merged Milestone 2 handoff at 092dc5f in the original project folder; began the authorized isolated Pyodide feasibility investigation. Recorded local runtime evidence and remaining activation gates in docs/milestone-3-verification.md. No learner integration or publication.

- 2026-10-13: Owner authorized preserving the existing uncommitted feat/pyodide-feasibility work while completing upstream licence notices and a local static preview package. Prepared versioned assets, Pyodide source availability, proposed host headers and package checks; learner execution remains disabled. See docs/pyodide-spike/PREVIEW.md and docs/milestone-3-verification.md for exact checks and limitations. No commit, push, PR or deployment.

- 2026-10-13: Addressed the layout matrix's shared timeout budget by giving each published route/viewport its own test. Preserved all assertions, screenshots and default timeouts. Full desktop/mobile Chromium suite passed 82 cases; app and runner behaviour, existing uncommitted feasibility work and preview package are preserved. No commit or publication.

- 2026-10-13: Corrected the stale current layout-timeout statement and verification-table formatting; the runtime summarizer no longer emits an application-layout limitation. Tested the generator on a disposable copy of fresh readiness evidence, preserving all five original evidence/package snapshots. Documentation and syntax checks passed. Existing readiness evidence, Git work and activation/publication gates are unchanged.

- 2026-10-13: Owner authorized developer-preview publication and necessary local commits, retaining owner control of push/PR. Researched current official Vercel terms/allowances and recorded the Hobby pentesting restriction and model-training opt-out in docs/hosting-terms-2026-10-13.md. No paid upgrade, support message, commit or deployment performed in this research turn.

- 2026-10-13: Owner confirmed Vercel Hobby. Connected Vercel API reports an active Hobby account; default-team read returned 403, with no installed CLI fallback. No upload or deployment attempted. Committed the reviewed layout fix locally at 606b7cd; prepared the remaining Milestone 3 snapshot for a separate local commit. Added a local Git text attribute to retain upstream licence/notice bytes across Windows checkouts. Package checks passed; push/PR remain owner actions.

- 2026-10-13: Followed the Vercel setup guide; installed CLI 63.1.2, verified authenticated Hobby/workspace access and retained the globally enabled plugin. Published a separate protected developer preview from a digest-verified staging copy. Disabled toolbar injection and removed the CDN wildcard CORS header with a response transform; all 57 ordinary hosted GET checks and local package checks passed. Preserved original packages/evidence and disabled learner execution. See docs/vercel-setup-2026-10-13.md. Hosted adversarial probes and remaining activation gates were not run. No push, PR or merge.

- 2026-10-13: Reviewed remaining Gate 3 checks from clean feat/pyodide-feasibility at a708161. Rechecked official Vercel security-testing policy: hosted adversarial probes stay blocked on Hobby without explicit provider clarification. Recorded a three-job benign hosted Chromium startup/cache proposal; no browser test or gate advancement. Existing evidence and learner execution restrictions are preserved.
