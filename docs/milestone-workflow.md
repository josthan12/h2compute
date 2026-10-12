# H2Compute — Milestone and Git Workflow

**Saved:** 12 October 2026
**Purpose:** Reusable workflow for continuing the approved roadmap. Read this with AGENTS.md, implementation.md, roadmap.md and current-status.md before each task.

## Current direction

Planning research is complete and the owner approved theory-first implementation. The repository and origin remote are connected; Milestone 1 is merged and Milestone 2 has a local three-lesson implementation. Use current-status.md for current checks and review limits. Build lessons, quizzes, offline practice/model explanations and local progress first. Evaluate Pyodide only after the first theory topic works. Browser practice uses visible examples and local self-checks; hosted grading/private tests are deferred.

The owner's supplied Git guidelines included an earlier “Phase 1: Planning and Feasibility” snapshot. That snapshot is historical; the later theory-first approval and current-status.md determine present implementation scope. The Git rules below remain in force. This file does not grant permission for new paid services, hosted grading or expanded scope.

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
2. **Inspect Git.** Check branch/status and review existing changes. Stop and report uncommitted changes, divergence or conflicts before switching/pulling; do not discard, overwrite or automatically stash them. Obtain an explicit disposition if necessary.
3. **Prepare the branch.** With a clean working tree, synchronize main with origin/main using a fast-forward pull, then create a task-specific branch from that updated main. Do not start from an old feature branch. An explicitly authorized exception can preserve existing changes on a documentation branch, as recorded below.
4. **Implement one focused change.** Follow approved scope and syllabus references. Explain any dependency's purpose, maintenance and cost. Preserve existing user work and secrets. Complete error/accessibility states as part of the feature.
5. **Verify.** Add/update meaningful tests when behavior changes; run applicable lint, typecheck, tests and production build. Test educational examples and relevant mobile/keyboard/failure paths. A documentation-only task needs relevant link/consistency/whitespace checks, not invented application-test results.
6. **Review and record.** Inspect the diff for correctness, scope and secrets. Summarize what changed, why, exact checks/results and limitations. Update current-status.md and roadmap checkboxes; mark only work actually completed. Give a concrete reviewable result and next task.
7. **Commit and PR only when authorized.** Stage only relevant files, use descriptive Conventional Commits and keep logical changes together. Do not automatically commit or push. When publishing is authorized, push the feature branch and open a PR targeting main; describe what/why/testing/known limitations. Review it before requesting merge approval. Never merge without explicit approval.
8. **Continue from the completed gate.** After an approved merge, update local main before starting another task. Perform branch cleanup only when appropriate and authorized. Existing theory approval need not be requested again; new costs/services/scope/privacy commitments need separate authorization.

Do not advance a milestone while its required checks fail. Fix authorized problems where possible; report genuine blockers and preserve the usable theory fallback. Owner review is a checkpoint, not a requirement to repeat approval for ordinary work already authorized.

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

Never commit API keys, .env.local, credentials or other secrets. A permission to edit is not permission to commit/push/merge.

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

> Continue Milestone [number] from current-status.md. Read AGENTS.md, implementation.md, roadmap.md and docs/milestone-workflow.md. Inspect the branch and working tree; follow the feature-branch rules and preserve existing changes. Deliver the smallest complete approved slice, run relevant checks, report exact results and update status/roadmap. Keep later milestones deferred. Do not commit, push or merge without explicit authorization.

After the current topic is reviewed and merged:

> Continue Milestone 3 feasibility only: read the current status, inspect Git, and validate a pinned runtime and isolated runner on the actual deployment. Keep editor integration and executable learner controls deferred until all activation gates pass. Do not commit, push, publish or merge without authorization.

## Exception recorded for saving this workflow

On 12 October 2026, main had existing uncommitted planning changes and local main matched the existing origin/main tracking reference. The owner explicitly authorized creating docs/milestone-workflow at the current HEAD, retaining all changes without committing or stashing. No pull/fetch was performed while dirty; the tracking comparison is not a fresh remote check. The new branch was created before this file was written. This exception does not authorize automatic branch switching, stashing, commits or publication on future tasks.
