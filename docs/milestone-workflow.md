# H2Compute — Milestone and Git Workflow

**Saved:** 12 October 2026
**Workflow updated:** 15 October 2026 — autonomous delivery and independent agent review authorized by the owner.
**Purpose:** Reusable workflow for continuing the approved roadmap. Read this with AGENTS.md, implementation.md, roadmap.md and current-status.md before each task.

## Current direction

### Current-session authorization — 12 November 2026

The owner now authorizes the agent to push and create/update the PR for this
repository and requests incremental milestones, defensive programming and
fallback plans. Follow [the delivery plan](delivery-plan-2026-11-12.md).
This narrowly supersedes the older owner-only push/PR wording below. Continue
on the already authorized current branch; no branch switch/history rewrite,
merge, protection change, production publication, learner activation, paid
service, scope/privacy expansion or external policy contact is authorized.
Keep all writes and remote mutations confined to ProjectALEVEL/
`josthan12/h2compute`; do not change global configuration or other projects.
Use explicit HTTPS Git operations with existing credentials to avoid the saved
owner-only SSH handoff. Independent candidate review remains mandatory.

Current handoff: Milestones 1 and 2 merged at local main/saved origin/main 092dc5f. Milestone 3 investigates a developer-only prototype on feat/pyodide-feasibility in the original project folder. See current-status.md and milestone-3-verification.md; activation remains gated. The historical workflow context below is retained.

Planning research is complete and the owner approved theory-first implementation. The repository and origin remote are connected; Milestone 1 is merged and Milestone 2 has a local three-lesson implementation. Use current-status.md for current checks and review limits. Build lessons, quizzes, offline practice/model explanations and local progress first. Evaluate Pyodide only after the first theory topic works. Browser practice uses visible examples and local self-checks; hosted grading/private tests are deferred.

The owner's supplied Git guidelines included an earlier “Phase 1: Planning and Feasibility” snapshot. That snapshot is historical; the later theory-first approval and current-status.md determine present implementation scope. The Git rules below remain in force. This file does not grant permission for new paid services, hosted grading or expanded scope.

## Owner checkpoint and agent responsibility

The owner approved this working arrangement on 15 October 2026. The agent owns
milestone planning, routine technical decisions, implementation, failure
diagnosis, applicable tests/build/browser checks, documentation, evidence,
local commits and a draft PR description. Carry authorized work through to a
verified milestone result; do not hand routine implementation or testing back
to the owner or request permission for each small step.

The owner checks the completed milestone, pushes and opens the PR. Push and PR
creation remain owner actions; merging is not authorized. Preserve narrower
session restrictions, including the current Milestone 3 branch-switch,
protection-change and learner-activation restrictions. This arrangement does
not authorize paid services, scope/privacy changes, third-party messages or
testing prohibited by the host. Request missing authorization/access only when
it is a genuine blocker, and continue independent authorized work where useful.

On 15 October 2026 the owner explicitly chose **keep external contact blocked**
for the Vercel policy question. Do not post the retained draft or send a support
message. Hosted adversarial checks remain blocked; continue permitted local
verification without treating this decision as provider permission.

Before every completed change or milestone handoff, call an independent reviewer
agent and obtain its explicit sign-off using
[the independent review protocol](independent-review.md). The reviewer builds its
own checklist, inspects the candidate commit and records its verdict. Fix and
re-review actionable findings before presenting the result as complete. Routine
progress and blocker reports may explain unfinished work without claiming sign-off.
Missing physical-device/provider evidence must remain an unmet gate. The reviewer
cannot waive milestone criteria or grant owner-only permissions.

## Road plan

| Milestone | Deliverable | Completion gate | Suggested branch |
| --- | --- | --- | --- |
| 0 — Planning | Verified syllabus references, scope, hosting and runner direction | Research/decisions recorded; implementation approval received | docs/phase-1-feasibility |
| 1 — Theory foundation | Minimal Next.js/TypeScript, content validation, navigation, quiz/local progress and one complete lesson journey | Relevant checks pass; lesson → quiz → offline practice → completion works | feat/project-setup |
| 2 — First complete topic | Python control flow: branching, loops, combined flow/tracing | Original reviewed examples/quizzes; accessible mobile/keyboard journey and resilient progress | feat/python-control-flow |
| 3 — Browser feasibility, then practice | Verify Pyodide first; add editor/Run/Stop/Reset/Check examples only if feasible | Isolation, cancellation, output bounds, state reset and deployed browser compatibility pass | feat/pyodide-feasibility, then feat/python-runner |
| 4 — Content and hardening | Connected lessons within the three MVP areas; coverage/privacy/feedback and deployment | Content, accessibility, application and release checks pass | Separate focused feat/*, fix/* or chore/* branches |
| 5 — Public beta | Publication, feedback/corrections and truthful portfolio evidence | Limitations disclosed and shipped claims supported | Focused release/documentation branches |

Only Python programming, algorithms/data structures and relational databases/SQL are in scope. Milestone 3 is conditional: if browser execution fails its gates, continue the theory/quizzes/offline-practice beta. Milestone numbers match roadmap.md; they do not imply full-syllabus completeness or fixed delivery dates.

## Repeat this workflow for each task

1. **Read and scope.** Read the current plans/status and inspect existing implementation/checks. State the smallest student-facing deliverable and acceptance criteria. Prefer one complete journey over broad empty scaffolding.
2. **Inspect Git.** Check branch/status and review existing changes. Stop and report unexpected pre-existing uncommitted changes, divergence or conflicts before switching/pulling; do not discard, overwrite or automatically stash them. Preserve the agent's own in-scope changes during the current task. Obtain an explicit disposition for unexpected work if necessary.
3. **Prepare the branch.** With a clean working tree, synchronize main with origin/main using a fast-forward pull, then create a task-specific branch from that updated main. Do not start from an old feature branch. An explicitly authorized exception can preserve existing changes on a documentation branch, as recorded below.
4. **Implement one focused change.** Follow approved scope and syllabus references. Explain any dependency's purpose, maintenance and cost. Preserve existing user work and secrets. Complete error/accessibility states as part of the feature.
5. **Verify.** Add/update meaningful tests when behavior changes; run applicable lint, typecheck, tests and production build. Test educational examples and relevant mobile/keyboard/failure paths. A documentation-only task needs relevant link/consistency/whitespace checks, not invented application-test results.
6. **Prepare and independently review.** Inspect the diff for correctness, scope and secrets. Update current-status.md and roadmap checkboxes truthfully, preserving historical evidence. Make a focused local candidate commit, then call a separate reviewer agent under independent-review.md. Fix findings, rerun affected checks and obtain sign-off on the final candidate. Local commits are authorized by the owner's standing workflow instruction; stage named relevant files and use descriptive Conventional Commits.
7. **Hand off the verified result.** Only after independent sign-off, present the completed milestone with acceptance coverage, exact check results, remaining limitations, local commit IDs, the review receipt and a draft PR description. The owner performs final review, push and PR creation. A focused prerequisite/documentation task may have its own scoped sign-off without completing the milestone. Do not push, open a PR or merge under this standing authorization.
8. **Continue from the completed gate.** After an approved merge, update local main before starting another task. Perform branch cleanup only when appropriate and authorized. Existing theory approval need not be requested again; new costs/services/scope/privacy commitments need separate authorization.

Do not advance a milestone while its required checks fail or remain unverified. Fix authorized problems where possible; report genuine blockers and preserve the usable theory fallback. Independent review is required before a completion claim. Owner review is a checkpoint, not a requirement to repeat approval for ordinary work already authorized.

## Git rules

### Branches

- main: stable, reviewed, working code; no direct feature/documentation edits.
- feat/*: new functionality.
- fix/*: bug fixes.
- docs/*: documentation/planning.
- refactor/*: restructuring without behavior changes.
- chore/*: configuration/dependencies/maintenance.

One focused task per branch. Do not add develop or full GitFlow unless explicitly requested.

### Start a clean task

```sh
git status --short --branch
git switch main
git pull --ff-only origin main
git switch -c feat/feature-name
```

Run branch/pull commands only after the status review confirms it is safe. If pull diverges or conflicts arise, stop and report rather than resetting or rewriting history. Never force-push, reset, discard changes or rewrite shared history without explicit permission.

### Before an authorized commit

```sh
git status
git diff
```

Stage named relevant files rather than unrelated work. Conventional Commit examples:

```text
feat: add lesson rendering
feat: implement quiz scoring
fix: handle Python runner timeout
docs: save milestone workflow
test: add quiz validation tests
chore: configure ESLint
```

Never commit API keys, .env.local, credentials or other secrets. The standing authorization permits relevant local commits; it does not permit push, PR creation or merge. Review draft commits before handoff and preserve independent sign-off validity.

### After an approved merge

```sh
git switch main
git pull --ff-only origin main
git branch -d feat/feature-name
```

Check working-tree safety first. Delete the remote feature branch only when appropriate and authorized. The next task starts from updated main.

## Milestone-specific review

- **Theory:** precise 2026 references, original explanations, tested examples, fair quiz scoring, local persistence/reset and accessible content.
- **Pyodide:** real deployed isolation/worker/loading tests, genuine infinite-loop cancellation, bounded output/messages, fresh cases/jobs, source/privacy and device resource limits. Mock execution alone does not prove feasibility. All tests/results are visible self-checks.
- **Beta:** disclosed partial coverage, corrected serious content/accessibility/security issues, deployment/hosting limits and useful feedback route. Do not add accounts, SQL execution or hosted grading to fill unrelated gaps.

## Reusable continuation prompt

> Continue Milestone [number] from current-status.md under the autonomous workflow. Read AGENTS.md, implementation.md, roadmap.md, docs/milestone-workflow.md and docs/independent-review.md. Preserve existing work and session restrictions. Complete authorized work, diagnose failures, run applicable checks, update evidence/status and create focused local commits. Call a separate reviewer with its own checklist; fix findings and obtain explicit sign-off before presenting completed work. The owner reviews the completed milestone, pushes and opens the PR. Do not push, open a PR, merge or broaden authorization. Report genuine blockers honestly.

After the current topic is reviewed and merged:

> Continue Milestone 3 feasibility only under the autonomous workflow: inspect current status/Git and complete permitted verification of the pinned runtime and isolated runner. Keep hosted adversarial probes blocked under the Hobby policy decision and preserve learner-activation/protection/branch restrictions. Local commits are authorized; deployment or other separately gated actions need existing specific authorization. Obtain independent agent sign-off before a completed handoff. The owner handles push and PR; do not merge or claim missing device/provider evidence passed.

## Exception recorded for saving this workflow

On 12 October 2026, main had existing uncommitted planning changes and local main matched the existing origin/main tracking reference. The owner explicitly authorized creating docs/milestone-workflow at the current HEAD, retaining all changes without committing or stashing. No pull/fetch was performed while dirty; the tracking comparison is not a fresh remote check. The new branch was created before this file was written. This exception does not authorize automatic branch switching, stashing, commits or publication on future tasks.
