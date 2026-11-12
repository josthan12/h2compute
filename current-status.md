# Current Status

**Last updated:** 12 November 2026
**Overall status:** Local theory-beta candidate across all three approved areas; public release is blocked by outstanding external evidence/access. Milestones 4/5 are not complete. Milestone 3 stays NO-GO for learner activation.
**Implementation:** Eight lessons, sixteen explanatory MCQs and eight offline tasks: Python control flow (3), list searching (2), relational data/SQL (3). Topic-specific navigation, incomplete filtering and resilient account-free local progress are implemented. No learner execution, account, hosted grader or new service. The developer-only spike/preview and historical evidence are preserved.

## Incremental delivery authorization — 12 November 2026

The owner now authorizes the agent to push and create/update the PR and asks for
small milestone-based improvements, defensive programming and fallback plans,
with all changes confined to this repository. This supersedes the earlier
owner-only push/PR wording for this continuation; merge and production/learner
activation remain unauthorized. No global configuration or other project may
be changed. Existing current-branch and SSH restrictions remain; explicit
HTTPS operations use existing credentials without changing those settings.

Follow [the incremental delivery plan](docs/delivery-plan-2026-11-12.md):
D1 bounded CI/deployment hold and reviewed draft publication; D2 separately
reproduced two-tab progress recovery/reset fixes; D3 exact-head hosted evidence.
The current clean baseline was `5a3be84`. Existing local beta sign-off is in
[its receipt](docs/reviews/2026-11-12-local-beta-review.md). Every new increment
requires independent review; public-beta milestone gates remain open.

Current repo-only reads confirm existing GitHub ADMIN access, no existing PR for
this branch and no existing milestones. Fresh HTTPS ref listing reports main
`092dc5f3014a64e5a3d6255dac6ecfb784790769`; the feature ref is not yet published.
Full branch scope includes preserved developer-only feasibility history as well
as the beta. See [delivery verification](docs/delivery-verification-2026-11-12.md)
and [full-branch draft description](docs/delivery-pr-description-2026-11-12.md).

## Beta continuation — 12 November 2026 (earlier local handoff)

The owner explicitly authorized beta work **on the current branch** after the
agent identified the saved focused-branch workflow conflict. Work remains in
the original checkout on feat/pyodide-feasibility, starting from clean
9da44a0b31df4c7875efaf7eee9f7949ea16bd21. No branch switch, fetch, stash, push,
PR, merge, deployment, protection change, external message or learner activation.
This exception applies to this beta work; it does not erase the usual workflow.

See [beta verification/checklist](docs/beta-verification-2026-11-12.md),
[setup and release steps](docs/beta-release-2026-11-12.md) and
[draft PR description](docs/beta-pr-description-2026-11-12.md).
The candidate must receive independent agent sign-off before a completed
handoff. Scoped local sign-off cannot complete the release gates below.

- Implemented: connected theory/quiz/offline journeys in all three areas;
  precise partial coverage/provenance; topic navigation/filtering; local
  progress migration/reset/recovery; privacy and verified external feedback route.
- Verified local checks and repaired failures: see the dated verification record
  for exact commands, versions and final outcomes. Next/config are patched to
  16.4.6 with a scoped lint-tool override; the current audit reports zero known
  vulnerabilities. This is a dated result, not a security certification.
- Blocked release evidence: independent teacher/student feedback and educational/
  screen-reader accessibility review; real-device review; production theory-beta
  deployment and candidate hosted CI; current host project/allowance. Public
  GitHub reports main unprotected; detailed protection access and owner review
  remain open. Connector team/project/billing access is 403 and CLI is signed
  out. Restoring deliberate authentication/scoped access is the smallest hosting
  access action. No unverified gate is marked passed.
- Deferred: browser execution/editor, optional donations and all previously
  deferred scope. Runner policy/device/low-memory/actual-host security gates
  remain open; they do not block the theory-only beta's local work.

Historical records below describe their dates, not the current beta candidate.

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

## Historical Git handoff — October 2026

Work is in C:/Users/crate/Documents/ProjectALEVEL on feat/pyodide-feasibility. At the start of the original feasibility investigation, elevated Git status was clean. At the 13 October preparation continuation, the expected uncommitted work was present; the owner explicitly authorized preserving it on this branch. At the initial handoff HEAD, local main and saved origin/main matched 092dc5f; main...origin/main is 0/0. The owner reported squash-merging PR #2. No fresh remote fetch or hosted CI verification is claimed. Backup branch backup/original-planning-2026-10-12 remains at 516e0dd. The older .codex worktree remains intact and untouched.

The owner authorized local Milestone 3 commits; the layout-test correction is committed at 606b7cd, and the preparation snapshot is recorded in the following local commit on the same branch (see git log). Local main/saved origin/main remain at 092dc5f. No push, PR or merge has been performed; pushing and PR creation remain owner actions. The later owner-authorized developer preview is recorded below. SSH commands must be requested from the owner in Bash, with a reply of “Done”, before dependent work continues.

## Permitted feasibility continuation — 20 October 2026

Firefox now launches from a separate verified extraction of the exact pinned
browser bytes; the installed cache is untouched and its path-specific failure
remains undetermined. Local Firefox passed three package startup jobs and 32
recovery records / 20 authored comparisons. Firefox and WebKit each passed ten
local boundary/protocol observations, including direct native network denial to
a listening loopback trap. A six-job bounded Chromium resource observation passed
143 complete snapshots; sampled maxima were 424,452,096-byte aggregate working set
and 337,223,680-byte aggregate private commit. These are desktop observations,
not genuine low-memory or mobile results, and the diagnostic cap is no learner
memory quota.

Under the existing developer-preview publication authorization, the already
reviewed package was published to a new protected preview. All 57 ordinary GET
checks and three fixed I/O jobs each in Chromium, WebKit and Firefox passed.
Protection, feedback flags, production target and original preview/packages are
unchanged. See [the 20 October continuation](docs/pyodide-spike/CONTINUATION-20261020.md)
and [evidence index](docs/pyodide-spike/continuation-evidence-20261020.json).

Milestone 3 remains incomplete: hosted adversarial/security/recovery checks are
blocked on Hobby with external contact blocked by owner decision. Real Android/
iOS, genuine low-memory recovery, supported-device release policy and remaining
account allowance remain unverified. The new usage query returned billing cost
data unavailable for 1–20 October, not zero usage. Learner integration stays
gated. No push, PR, merge, branch switch, paid service or external message.

## Local compatibility continuation — 15 October 2026

The agent found and fixed a WebKit stdlib loading defect without changing CSP,
origin privileges, host/frame or upstream runtime bytes. Local Chromium passed
99 runtime records / 40 authored comparisons; WebKit passed 32 recovery records /
20 authored comparisons. A separate undeployed package passed all 57 delivery
checks and three Chromium/WebKit startup/I/O jobs each. The original hosted
package and prior evidence remain unchanged; it still has the WebKit loading
defect. Firefox fails before page load because of a Windows mozglue assembly
problem; no Firefox runner pass is claimed. See [the local desktop guide](docs/pyodide-spike/DESKTOP-CHECK.md).

The owner explicitly chose **keep external contact blocked**. The policy draft
stays unsent and hosted adversarial probes stay blocked on Hobby. The read-only
CLI usage query returned billing cost data unavailable, not zero usage; remaining
allowance is still unverified. Physical Android/iOS, supported-browser policy,
genuine low-memory/resource assessment and actual-host security/recovery remain
unmet. Milestone 3 is incomplete; learner execution stays disabled. Do not ask
the owner to push/open a PR as though this were a completed milestone.

## Remaining work and next action

1. Review the isolated prototype, local evidence and [prepared preview package](docs/pyodide-spike/PREVIEW.md). Retained upstream notices and Pyodide source availability are packaged locally; release review remains required. Basic hosted Chromium/Firefox/WebKit loading and I/O now pass on the new preview; activation remains blocked by deployed adversarial verification, supported-device policy/physical devices and practical memory limits.
2. The owner authorized developer-preview publication and necessary local commits on 13 October; pushing and PR creation remain owner actions. [Hosting terms research](docs/hosting-terms-2026-10-13.md) is complete. CLI access verified active Hobby and the correct workspace; the owner confirmed model-training opt-out. Monitor remaining usage and personal/non-commercial eligibility. The current official policy excludes Hobby pentesting; no browser-only exemption was found, so hosted adversarial probes remain blocked pending explicit provider clarification. The three benign hosted Chromium jobs passed on 15 October: exact fixed I/O, startup, same-page/reload cache measurements and successful frame/worker cleanup. See the dated continuation in docs/milestone-3-verification.md and docs/pyodide-spike/hosted-benign-results-20261015.json. This does not pass deployed adversarial or device gates. Local commits are authorized; learner execution remains disabled. The [Vercel setup record](docs/vercel-setup-2026-10-13.md) records the protected preview and all 57 ordinary authenticated GET checks. CLI workspace access works; MCP workspace reads remain blocked by 403. Basic fixed-program hosted execution now passes; hostile-job recovery and device gates remain open.
3. Obtain real-device Safari/iOS and Android evidence and choose an honest supported-browser policy. Emulation is not device evidence.
4. Add CodeMirror and learner-facing Run/Check examples only after the full feasibility/activation gate passes; preserve theory/offline fallback.
5. Independent educational/screen-reader review, host free terms, deployment and branch protection remain release requirements.
6. The local layout-test timeout follow-up is resolved: split the ten-route/three-width matrix into independent cases with unchanged 30-second limits and assertions. All 82 desktop/mobile Chromium tests passed. Physical-device and independent accessibility review remain release requirements; see the follow-up in docs/milestone-3-verification.md.

Existing npm audit reports five high-severity entries tracing to the development-only ESLint braces chain. No automated dependency changes were made. Pyodide compute has no provider fee, but the 13,531,207-byte uncompressed core consumes host bandwidth; no promise of permanent zero-cost hosting.

Local preparation verification: all 57 packaged response/hash/header checks and two packager safety tests passed. The final Chromium runtime suite passed with 99 evidence records and 40 exact authored comparisons; see [preview evidence](docs/pyodide-spike/preview-evidence-summary.json). Lint, typecheck, content validation, 12 unit tests, 42 local Python runs, production build and contrast checks passed. The later layout-test follow-up passed all 82 browser cases; it supersedes the preparation session's unresolved timeout. No deployment/device safety is claimed. The loopback server is stopped.

Hosted benign continuation (15 October): desktop Chromium 156.0.8078.4 passed three fixed jobs within unchanged 30-second loading/five-second execution limits. Cold/warm/reload startup was 2.616/1.615/1.905 seconds. Same-page core transfers were zero; all five post-reload core responses came from Chromium disk cache with zero transferSize. The cold encoded core body was 6,420,696 bytes (Brotli/ZIP); browser transferSize was 6,422,196 bytes. [New sanitized evidence](docs/pyodide-spike/hosted-benign-results-20261015.json) is separate from every prior snapshot. These are single-run observations and basic functional checks, not a sandbox/device/performance certification. Driver unit tests and lint passed; application code/package are unchanged. Milestone 3 remains incomplete and learner execution disabled.

## Change log

- 2026-10-20: Continued permitted Milestone 3 verification. Added a pinned private Firefox cache, local Firefox/WebKit boundary/message probes and bounded Windows resource observations. Refreshed only the protected developer preview with the already reviewed package; all 57 ordinary delivery checks and nine fixed jobs across three engines passed. Preserved original evidence and all activation/provider/device gates; no roadmap checkbox advances.


- 2026-10-15: Continued local desktop feasibility; corrected WebKit stdlib loading with fixed preloaded responses under the original CSP. Retained Chromium/WebKit successes and original Firefox/WebKit failures, a separate undeployed package, reproducible local drivers and the explicit external-contact block. Usage allowance remains unknown. No milestone gate advances or learner activation/publication.


- 2026-10-15: Continued Milestone 3 with a separate bounded benign browser driver, target/session/output tests and new sanitized hosted evidence. Local and protected hosted Chromium each passed three jobs; recorded startup, core transfer/cache and successful cleanup. Used an existing exact-host HttpOnly session without changing protection. Preserved all earlier evidence/packages; no gate checkbox advanced, learner activation, deployment, push, PR or merge.

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
