# Roadmap

**Status:** Milestone 1 merged; Milestone 2 bounded topic implemented locally. This branch’s hosted CI and deployment remain pending.
**Scope:** Python programming, algorithms/data structures and relational databases/SQL only. Start with Python control flow. Browser practice follows theory; hosted grading is deferred.

Use [docs/milestone-workflow.md](docs/milestone-workflow.md) for the repeatable task/Git workflow, milestone gates and continuation prompts.

## Phase 0 — Planning (completed research, conditional runtime gate)

- [x] Verify official 2026 outcomes, exclusions and partial coverage.
- [x] Investigate Judge0 and compare hosting/cost constraints; preserve dated findings.
- [x] Owner approves theory-first work, Vercel Hobby and Python control flow first.
- [x] Document Pyodide browser-practice direction, visible-test rules and theory-only fallback.
- [x] Verify repository and configured origin remote.

The [historical feasibility review](docs/phase-1-feasibility.md) is research, not evidence of live runtime/deployment success. Current decisions are in implementation.md and docs/decisions/runner-provider.md.

## Phase 1 — Minimal theory foundation

- [ ] Verify branch/CI settings; preserve existing worktree changes. Local branch and preservation verified; CI configured. Owner reported passing checks for merged PR #1. Branch protection remains unverified.
- [x] Set up Next.js/TypeScript, Tailwind CSS/daisyUI as the styling system and relevant lint/typecheck/tests/build/CI.
- [x] Load Git-based content with validated metadata, numeric syllabus references and internal links.
- [x] Establish readable responsive navigation and accessible lesson/quiz components.
- [x] Add defensive versioned local progress, refresh persistence and reset.
- [x] Prove one original Python control-flow lesson → quiz → offline practice/model explanation → completion journey.

**Local exit:** one theory journey works without an editor, runner dependency or execution backend. See [verification](docs/milestone-1-verification.md). Milestone 1 checks passed per owner; branch protection and deployment remain pending; this is not public-beta release evidence.

## Phase 2 — First complete theory topic

The three-lesson implementation and local checks are recorded in [Milestone 2 verification](docs/milestone-2-verification.md). Independent teacher review, real devices, screen readers and deployment remain separate review/release limits.

- [x] Complete sequence/branching, counted/conditional loops and combined flow/tracing lessons.
- [x] Include prerequisite refresher, worked examples, misconceptions and explanatory quizzes.
- [x] Add original practice prompts/model explanations and local self-marked completion.
- [x] Review precise 2026 mappings and test every Python example locally.
- [x] Verify keyboard/mobile use, refresh/reset and corrupted-storage recovery.

**Exit:** the bounded Python control-flow topic provides a connected revision journey. This is not complete Python or full-syllabus coverage.

## Phase 3 — Browser Python feasibility, then practice

- [ ] Pin/review Pyodide and target Python version; choose minimal runtime assets and retain licence notices.
- [ ] Verify asset sizes, loading/cache/CORS/CSP on the deployment; budget host bandwidth.
- [ ] Prototype isolated iframe + module worker; prove main-site storage/DOM/cookie/navigation and unauthorized network separation.
- [ ] Verify supplied stdin/stdout, syntax/runtime errors, infinite loops, output floods, cancellation, fresh case/job state and stale-message rejection.
- [ ] Check supported desktop/mobile startup and memory/performance limitations.
- [ ] If feasible, add CodeMirror and a replaceable Pyodide adapter with Run, Stop/Reset and Check examples.
- [ ] Use visible cases and local self-check labels; no hidden tests or trusted-grade claims.
- [ ] Keep theory usable during runtime failure; preserve editor text and progress.

**Exit:** implementation.md Gate 3 passes before browser activation. If it fails, retain theory/quizzes and offline practice; do not add a paid/hosted service by assumption.

## Phase 4 — MVP content and beta hardening

- [ ] Expand reviewed connected lessons within the three confirmed areas; keep lesson/exercise counts flexible.
- [ ] Display planned/published/partial/uncovered outcomes and related revision links.
- [ ] Add filtering/search only where useful; validate links/content in CI.
- [ ] Add privacy/attribution, feedback and optional external donation link.
- [ ] Recheck Vercel Hobby terms/usage, verify production deployment and run relevant automated/manual checks.
- [ ] If browser practice ships, verify runner security/recovery on deployed browsers and disclose self-check limitations.
- [ ] Obtain student/teacher feedback and resolve serious accuracy/accessibility/security problems.

**Exit:** worthwhile theory beta with honest coverage and no mandatory runner. Runtime controls appear only if the browser gate passes.

## Phase 5 — Public beta and portfolio evidence

- [ ] Publish site/repository, setup guidance, screenshots and known limitations.
- [ ] Record corrections, release notes and engineering decisions.
- [ ] Draft resume claims only from shipped features and measured evidence.

## Later / deferred

Hosted grading (Judge0 or another provider), private tests and server execution API; self-hosted sandbox; extra languages; SQL execution; Flask/multi-file projects; accounts/cloud sync; dashboards; AI tutoring; social/gamification; paid features; large-scale analytics.

## Definition of done

Acceptance criteria and precise syllabus mapping; original reviewed content; meaningful relevant tests/build checks; accessible responsive states; error recovery; updated docs/status; no secrets/personal data; honest local self-check results. Paid services or broader scope require separate owner authorization.
