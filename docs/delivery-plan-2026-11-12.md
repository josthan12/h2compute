# Incremental beta delivery plan — 12 November 2026

## Authority and repository boundary

The owner now authorizes the agent to push commits and create/update the PR,
and asks for milestone-driven improvement with defensive behavior and fallback
plans. All writes and remote mutations are limited to ProjectALEVEL and its
existing `josthan12/h2compute` repository. No global Git/CLI/authentication
settings, other worktrees/projects, provider project settings or credentials
will be changed. Existing GitHub CLI credentials may be used through an explicit
HTTPS destination; the saved SSH handoff restriction is preserved by avoiding SSH.

The current-branch exception remains: continue `feat/pyodide-feasibility` without
switching branches or rewriting its history. New permission covers push/PR and
the requested repository milestones. It does not authorize merge, protection
changes, production publication, learner execution, paid services, scope/privacy
changes, hosted adversarial probes or third-party policy contact.

Starting state: clean HEAD `5a3be84`, containing the independently signed-off
local beta candidate `2864709` and its receipt. The whole unmerged branch also
contains earlier developer-only runner code/notices/evidence: 186 files versus
saved main, rather than a theory-only diff. Publication must disclose that scope
and preserve the runner's disabled/NO-GO status.

## Delivery increments

These are bounded increments within roadmap Milestones 4/5, not replacements
for their external exit gates. Complete and review each increment before
starting the next implementation; integrate through the same draft PR.

### D1 — bounded repository delivery

- Record current authority and maintain existing milestone gates.
- Bound CI time/concurrency/artifact retention, avoid persisted checkout
  credentials, pin the existing actions and run the existing offline runner
  driver unit tests. No deployment or runtime feasibility job is added.
- Add repository-local `git.deploymentEnabled: false` in `vercel.json` so Git
  publication is not an implicit Vercel release. Keep `.vercelignore` excluding
  the developer runner. This configuration affects this repository's future
  Git deployments; no other project's settings are mutated.
- Prepare an honest full-branch draft PR, review exact candidate, then push
  only its explicit feature ref over HTTPS. Verify the resulting remote SHA.
- Create the repository's roadmap milestones 3/4/5, attach the PR to content
  hardening, and watch actual hosted checks through a terminal result.

Acceptance: local configuration/driver checks and production checks apply;
fresh independent D1 sign-off; correctly targeted draft PR; actual CI result
recorded with exact head/run IDs. The PR remains draft while release gates are
open. A canceled superseded run is not a pass for the replacement run.

Fallback: on auth/ref mismatch or unexpected remote divergence, stop affected
publication, preserve local commits and never force-push. On a CI failure,
diagnose bounded logs, fix only the demonstrated in-scope defect, rerun/review
and publish the correction. An unavailable provider check stays unverified.

### D2 — progress recovery without lost updates

Discovery reproduced a real local two-tab failure: after tab A's save fails,
tab B saves another lesson; A's successful retry overwrites B's flags from a
stale in-memory snapshot. Existing external-reset tests do not cover this case.

Acceptance: retain only pending local changes, apply them to freshly readable
saved progress, preserve unrelated updates, and discard pending changes on
external reset, including a peer reset when the key was already absent and
therefore no storage event fires. Any additional same-origin reset signal must
be feature-detected, narrowly validated and cleaned up, with the existing
storage-event fallback retained. In-memory learning still works when reads/writes are blocked;
no automatic background save or extra stored data is introduced. Test the
cross-tab failure/retry and reset cases against the production build, including
all existing migration/corruption/storage assertions. Integrate and review this
slice separately after D1's delivery result.

Fallback: if persistence remains unavailable, keep explicit visit-only progress
and the usable lessons/quizzes/offline tasks. Never erase unrelated saved flags
or silently claim that persistence succeeded.

### D3 — delivery evidence and next gate

After D2 sign-off, update the same PR and wait for its exact head's hosted CI.
Record milestone evidence, limitations and next actions. Keep the draft status
and all public-beta/runner gates truthful. A working local product, a passing
repository CI run, deployment readiness and public release are different states.

The remaining non-automatable gates are independent teacher/student feedback,
independent screen-reader/accessibility review, physical-device evidence,
current intended hosting project/allowance and reviewed production deployment,
plus the owner's protection/publication decisions. No synthetic evidence or
agent sign-off substitutes for those gates.

## Milestone status

| Increment | State | Evidence |
| --- | --- | --- |
| D1 | In progress | Clean baseline, target identity/auth confirmed; implementation/review/publication pending. |
| D2 | Reproduced; implementation queued | Two-tab data-loss reproduction by discovery agent; no fix claimed. |
| D3 | Pending D1/D2 | Exact-head CI and final delivery record required. |

Related: [roadmap](../roadmap.md), [independent review](independent-review.md),
[local beta review](reviews/2026-11-12-local-beta-review.md),
[release gates](beta-release-2026-11-12.md).
